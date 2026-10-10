// Django REST API client. All app data comes from here.
// Base URL can be overridden with VITE_API_BASE_URL.
type Raw = Record<string, unknown>;

export const API_BASE = ((import.meta.env.VITE_API_BASE_URL as string | undefined) ?? "http://127.0.0.1:8000/api").replace(/\/$/, "");
const TOKEN_KEY = "m2a_token";
const USER_KEY = "m2a_user";

export class ApiError extends Error {
  constructor(message: string, public status: number, public body: unknown) { super(message); }
}

// ---------- session storage ----------
export const getToken = () => (typeof window === "undefined" ? null : localStorage.getItem(TOKEN_KEY));
export function getStoredUser(): User | null {
  if (typeof window === "undefined") return null;
  try { const u = localStorage.getItem(USER_KEY); return u ? normUser(JSON.parse(u) as Raw) : null; } catch { return null; }
}
function saveSession(token: string | null, user: Raw | null) {
  if (token) localStorage.setItem(TOKEN_KEY, token); else localStorage.removeItem(TOKEN_KEY);
  if (user) localStorage.setItem(USER_KEY, JSON.stringify(user)); else localStorage.removeItem(USER_KEY);
}
export const clearSession = () => saveSession(null, null);

function getCookie(name: string) {
  if (typeof document === "undefined") return null;
  const m = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return m?.[1] ? decodeURIComponent(m[1]) : null;
}

// ---------- core request ----------
function errorMessage(body: unknown, status: number): string {
  if (body && typeof body === "object") {
    const b = body as Raw;
    for (const k of ["detail", "error", "message", "non_field_errors"]) {
      const v = b[k];
      if (typeof v === "string") return v;
      if (Array.isArray(v) && v.length) return String(v[0]);
    }
    const first = Object.entries(b)[0];
    if (first) return `${first[0]}: ${Array.isArray(first[1]) ? String(first[1][0]) : String(first[1])}`;
  }
  if (typeof body === "string" && body && !body.startsWith("<")) return body;
  return status === 0 ? "Cannot reach the server. Is the Django backend running?" : `Request failed (${status})`;
}

export async function api<T = unknown>(path: string, opts: { method?: string; body?: unknown; auth?: boolean } = {}): Promise<T> {
  const method = opts.method ?? "GET";
  const headers: Record<string, string> = { Accept: "application/json" };
  if (opts.body !== undefined) headers["Content-Type"] = "application/json";
  const token = getToken();
  if (token && opts.auth !== false) headers["Authorization"] = `Token ${token}`;
  if (method !== "GET") { const csrf = getCookie("csrftoken"); if (csrf) headers["X-CSRFToken"] = csrf; }

  let res: Response;
  try {
    res = await fetch(`${API_BASE}${path}`, { method, headers, body: opts.body === undefined ? null : JSON.stringify(opts.body) });
  } catch {
    throw new ApiError(errorMessage(null, 0), 0, null);
  }
  const text = await res.text();
  let body: unknown = text;
  try { body = text ? JSON.parse(text) : null; } catch { /* non-JSON */ }

  if (res.status === 401 && opts.auth !== false && token) {
    clearSession();
    if (typeof window !== "undefined" && !window.location.pathname.startsWith("/login")) window.location.assign("/login?expired=1");
  }
  if (!res.ok) throw new ApiError(errorMessage(body, res.status), res.status, body);
  return body as T;
}

// ---------- helpers for tolerant parsing ----------
const pick = (o: Raw | undefined, ...keys: string[]): unknown => { for (const k of keys) { const v = o?.[k]; if (v !== undefined && v !== null && v !== "") return v; } return undefined; };
const str = (v: unknown): string => {
  if (v == null) return "";
  if (typeof v === "object") { const o = v as Raw; return str(pick(o, "name", "full_name", "username", "title", "email")); }
  return String(v);
};
const num = (v: unknown): number => (typeof v === "number" ? v : Number(v) || 0);
const idOf = (v: unknown): string => (v && typeof v === "object" ? str((v as Raw)["id"]) : v == null ? "" : String(v));
const list = (v: unknown): Raw[] => (Array.isArray(v) ? (v as Raw[]) : v && typeof v === "object" && Array.isArray((v as Raw)["results"]) ? ((v as Raw)["results"] as Raw[]) : []);
const strList = (v: unknown): string[] => (Array.isArray(v) ? v.map((x) => (typeof x === "object" && x ? str(pick(x as Raw, "text", "title", "description", "decision", "name")) : String(x))).filter(Boolean) : typeof v === "string" && v ? [v] : []);

export function label(v: string): string {
  const s = v.trim();
  if (!s) return "";
  const low = s.toLowerCase().replace(/[-_]/g, " ");
  if (low === "todo" || low === "to do") return "To do";
  return low.charAt(0).toUpperCase() + low.slice(1);
}
export function fmtDate(v: string): string {
  if (!v) return "—";
  const d = new Date(v);
  return isNaN(d.getTime()) ? v : d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}
export const toInputDate = (v: string) => (/^\d{4}-\d{2}-\d{2}/.test(v) ? v.slice(0, 10) : "");

// ---------- models ----------
export type User = { id: string; name: string; email: string; initials: string; raw: Raw };
export function normUser(u: Raw): User {
  const first = str(pick(u, "first_name")); const last = str(pick(u, "last_name"));
  const name = str(pick(u, "full_name", "name")) || `${first} ${last}`.trim() || str(pick(u, "username", "email"));
  const initials = name.split(/[\s@.]+/).filter(Boolean).slice(0, 2).map((p) => p[0]?.toUpperCase()).join("") || "?";
  return { id: idOf(u["id"]), name, email: str(u["email"]), initials, raw: u };
}

export type Task = { id: string; title: string; description: string; assignee: string; due: string; priority: string; status: string; project: string; projectId: string; meetingId: string };
export function normTask(t: Raw): Task {
  const proj = t["project"];
  return {
    id: idOf(t["id"]), title: str(pick(t, "title", "name", "task")), description: str(t["description"]),
    assignee: str(pick(t, "assignee_name", "assigned_to_name", "assignee", "assigned_to", "owner")),
    due: str(pick(t, "due_date", "deadline", "due")), priority: str(t["priority"]), status: str(t["status"]),
    project: str(pick(t, "project_name", "project_title")) || (proj && typeof proj === "object" ? str(proj) : ""),
    projectId: idOf(pick(t, "project_id", "project")), meetingId: idOf(pick(t, "meeting_id", "meeting")),
  };
}

export type Project = { id: string; name: string; description: string; owner: string; status: string; total: number | null; done: number | null };
export function normProject(p: Raw): Project {
  const total = pick(p, "total_tasks", "task_count", "tasks_count"); const done = pick(p, "completed_tasks", "done_tasks");
  return { id: idOf(p["id"]), name: str(pick(p, "name", "title")), description: str(p["description"]), owner: str(pick(p, "owner_name", "owner", "created_by")), status: str(p["status"]), total: total === undefined ? null : num(total), done: done === undefined ? null : num(done) };
}

export type ProjectStats = { total: number; done: number; pending: number; pct: number };
export function normProjectStats(s: Raw): ProjectStats {
  const total = num(pick(s, "total_tasks", "total", "tasks"));
  const done = num(pick(s, "completed_tasks", "completed", "done", "done_tasks"));
  const pending = pick(s, "pending_tasks", "pending") !== undefined ? num(pick(s, "pending_tasks", "pending")) : total - done;
  const pctRaw = pick(s, "progress", "completion_rate", "completion_percentage", "percent_complete");
  const pct = pctRaw !== undefined ? Math.round(num(pctRaw) <= 1 && num(pctRaw) > 0 && !String(pctRaw).includes(".") === false ? num(pctRaw) * 100 : num(pctRaw)) : total ? Math.round((done / total) * 100) : 0;
  return { total, done, pending, pct: Math.max(0, Math.min(100, pct)) };
}

export type Meeting = { id: string; title: string; date: string; status: string; attendees: string[]; summary: string; decisions: string[]; followUps: string[]; taskCount: number | null; tasks: Task[]; projectId: string };
export function normMeeting(m: Raw): Meeting {
  const tasks = list(pick(m, "tasks", "extracted_tasks")).map(normTask);
  const tc = pick(m, "task_count", "tasks_count", "extracted_tasks_count");
  return {
    id: idOf(m["id"]), title: str(pick(m, "title", "name")) || "Untitled meeting", date: str(pick(m, "date", "meeting_date", "created_at")),
    status: str(m["status"]), attendees: strList(pick(m, "attendees", "participants")), summary: str(m["summary"]),
    decisions: strList(m["decisions"]), followUps: strList(pick(m, "follow_ups", "followups", "follow_up_items")),
    taskCount: tc !== undefined ? num(tc) : tasks.length || null, tasks, projectId: idOf(m["project"]),
  };
}

export type Notification = { id: string; type: string; title: string; meta: string; time: string; unread: boolean };
export function normNotification(n: Raw): Notification {
  const read = pick(n, "is_read", "read");
  return { id: idOf(n["id"]), type: str(pick(n, "type", "notification_type", "kind")), title: str(pick(n, "title", "message", "text")), meta: str(pick(n, "message", "body", "description")) === str(pick(n, "title", "message", "text")) ? "" : str(pick(n, "message", "body", "description")), time: fmtDate(str(pick(n, "created_at", "timestamp", "date"))), unread: read === undefined ? Boolean(n["unread"]) : !read };
}

export type Analysis = { raw: Raw; tasks: Raw[]; taskLabels: string[]; assignees: string[]; deadlines: string[]; decisions: string[]; followUps: string[]; summary: string };
export function normAnalysis(r: Raw): Analysis {
  const root = (r["data"] && typeof r["data"] === "object" ? r["data"] : r["result"] && typeof r["result"] === "object" ? r["result"] : r["analysis"] && typeof r["analysis"] === "object" ? r["analysis"] : r) as Raw;
  const tasks = list(pick(root, "tasks", "action_items", "extracted_tasks"));
  const nt = tasks.map(normTask);
  const counts = new Map<string, number>();
  nt.forEach((t) => t.assignee && counts.set(t.assignee, (counts.get(t.assignee) ?? 0) + 1));
  const assignees = strList(root["assignees"]).length ? strList(root["assignees"]) : [...counts].map(([n, c]) => `${n} — ${c} task${c === 1 ? "" : "s"}`);
  const deadlines = strList(root["deadlines"]).length ? strList(root["deadlines"]) : nt.filter((t) => t.due).map((t) => `${t.title} · ${fmtDate(t.due)}`);
  return { raw: root, tasks, taskLabels: nt.map((t) => t.title || "Untitled task"), assignees, deadlines, decisions: strList(root["decisions"]), followUps: strList(pick(root, "follow_ups", "followups", "follow_up_items")), summary: str(root["summary"]) };
}

// ---------- endpoints ----------
function tokenFrom(r: Raw): string { return str(pick(r, "token", "key", "auth_token", "access")); }
async function finishAuth(r: Raw): Promise<User> {
  const token = tokenFrom(r);
  if (!token) throw new ApiError("The server did not return a token.", 200, r);
  saveSession(token, (r["user"] as Raw | undefined) ?? null);
  return refreshMe();
}
export async function refreshMe(): Promise<User> {
  const r = await api<Raw>("/auth/me/");
  const u = (r["user"] && typeof r["user"] === "object" ? r["user"] : r) as Raw;
  saveSession(getToken(), u);
  return normUser(u);
}
export const login = async (email: string, password: string) => finishAuth(await api<Raw>("/auth/login/", { method: "POST", auth: false, body: { email, username: email, password } }));
export async function register(name: string, email: string, password: string) {
  const [first_name, ...rest] = name.trim().split(/\s+/);
  const r = await api<Raw>("/auth/register/", { method: "POST", auth: false, body: { username: email, email, password, password2: password, confirm_password: password, first_name: first_name ?? "", last_name: rest.join(" "), full_name: name.trim(), name: name.trim() } });
  if (tokenFrom(r)) return finishAuth(r);
  return login(email, password);
}
export async function logout() {
  try { await api("/auth/logout/", { method: "POST" }); } catch { /* session cleared anyway */ }
  clearSession();
}

export const getDashboardStats = () => api<Raw>("/dashboard/stats/");
export const getProjects = async () => list(await api("/projects/")).map(normProject);
export const getProject = async (id: string) => normProject(await api<Raw>(`/projects/${id}/`));
export const getProjectStats = async (id: string) => normProjectStats(await api<Raw>(`/projects/${id}/stats/`));
export const getProjectSummary = (id: string) => api<Raw>(`/projects/${id}/summary/`);
export const createProject = (body: Raw) => api<Raw>("/projects/", { method: "POST", body });
export const getMeetings = async () => list(await api("/meetings/")).map(normMeeting);
export const getMeeting = async (id: string) => normMeeting(await api<Raw>(`/meetings/${id}/`));
export const analyzeMeeting = async (body: Raw) => normAnalysis(await api<Raw>("/meetings/analyze/", { method: "POST", body }));
export const saveExtracted = (body: Raw) => api<Raw>("/meetings/save-extracted/", { method: "POST", body });
export const getTasks = async () => list(await api("/tasks/")).map(normTask);
export const createTask = (body: Raw) => api<Raw>("/tasks/", { method: "POST", body });
export const updateTask = (id: string, body: Raw) => api<Raw>(`/tasks/${id}/`, { method: "PATCH", body });
export const getNotifications = async () => list(await api("/notifications/")).map(normNotification);
export const markNotificationRead = (id: string) => api(`/notifications/${id}/read/`, { method: "PATCH" });
export const getAiStatus = () => api<Raw>("/ai/status/");

export { pick, str, num, list };
