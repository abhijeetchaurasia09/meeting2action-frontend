// Static placeholder content for visual development only.
// NOT connected to any backend — replace with Django REST API responses.
export type Task = { id: number; title: string; assignee: string; due: string; priority: string; status: string; project: string; projectId: number; meetingId: number; description: string };

export const sampleTasks: Task[] = [
  { id: 1, title: "Finalize Q4 pricing proposal", assignee: "Priya Shah", due: "Oct 8, 2026", priority: "High", status: "In progress", project: "Revenue Ops", projectId: 1, meetingId: 2, description: "Consolidate the tier comparison and get sign-off from finance." },
  { id: 2, title: "Share onboarding flow wireframes", assignee: "Daniel Kim", due: "Oct 10, 2026", priority: "Medium", status: "To do", project: "Product Design", projectId: 2, meetingId: 1, description: "Low-fidelity wireframes for the new self-serve onboarding." },
  { id: 3, title: "Confirm vendor contract renewal", assignee: "Maria Lopez", due: "Oct 4, 2026", priority: "High", status: "Overdue", project: "Operations", projectId: 3, meetingId: 3, description: "Confirm the renewal terms with the hosting vendor." },
  { id: 4, title: "Draft release notes for v2.3", assignee: "Arjun Mehta", due: "Oct 12, 2026", priority: "Low", status: "Done", project: "Platform", projectId: 4, meetingId: 1, description: "Summarize customer-facing changes in v2.3." },
  { id: 5, title: "Prepare churn analysis for leadership", assignee: "Priya Shah", due: "Oct 15, 2026", priority: "Medium", status: "To do", project: "Revenue Ops", projectId: 1, meetingId: 2, description: "Break down churn by plan and segment for Q3." },
  { id: 6, title: "Audit design system tokens", assignee: "Daniel Kim", due: "Oct 18, 2026", priority: "Low", status: "In progress", project: "Product Design", projectId: 2, meetingId: 1, description: "Remove unused color and spacing tokens." },
];

export const sampleProjects = [
  { id: 1, name: "Revenue Ops", owner: "Priya Shah", description: "Pricing, packaging and revenue reporting.", status: "Active" },
  { id: 2, name: "Product Design", owner: "Daniel Kim", description: "Onboarding redesign and design system upkeep.", status: "Active" },
  { id: 3, name: "Operations", owner: "Maria Lopez", description: "Vendor management and internal tooling.", status: "On hold" },
  { id: 4, name: "Platform", owner: "Arjun Mehta", description: "Core platform releases and reliability.", status: "Active" },
];

export const sampleMeetings = [
  { id: 1, title: "Weekly product sync", date: "Oct 1, 2026", attendees: ["Daniel Kim", "Arjun Mehta", "Priya Shah"], status: "Analyzed", summary: "Reviewed onboarding redesign progress and v2.3 release scope.", decisions: ["Ship v2.3 on Oct 14", "Onboarding redesign moves to usability testing"] },
  { id: 2, title: "Q4 planning workshop", date: "Sep 29, 2026", attendees: ["Priya Shah", "Maria Lopez", "Arjun Mehta"], status: "Analyzed", summary: "Set Q4 revenue priorities and agreed on pricing direction.", decisions: ["Adopt annual plan as default", "Pricing proposal due Oct 8"] },
  { id: 3, title: "Vendor review", date: "Sep 26, 2026", attendees: ["Maria Lopez"], status: "Processing", summary: "Reviewed upcoming vendor renewals.", decisions: [] as string[] },
];

export const sampleNotifications = [
  { id: 1, type: "assignment", title: "You were assigned “Finalize Q4 pricing proposal”", meta: "Revenue Ops · from Q4 planning workshop", time: "10 min ago", unread: true },
  { id: 2, type: "deadline", title: "“Confirm vendor contract renewal” is overdue", meta: "Operations · was due Oct 4", time: "1 hour ago", unread: true },
  { id: 3, type: "deadline", title: "“Share onboarding flow wireframes” is due in 2 days", meta: "Product Design · due Oct 10", time: "Today", unread: false },
  { id: 4, type: "assignment", title: "You were assigned “Audit design system tokens”", meta: "Product Design · from Weekly product sync", time: "Yesterday", unread: false },
];

export const sampleAnalysis = {
  tasks: ["Finalize Q4 pricing proposal", "Send onboarding wireframes", "Confirm vendor renewal terms"],
  assignees: [["Priya Shah", 1], ["Daniel Kim", 1], ["Maria Lopez", 1]] as [string, number][],
  deadlines: [["Pricing proposal", "Thu, Oct 8"], ["Wireframes", "Fri, Oct 9"], ["Vendor renewal", "Mon, Oct 12"]],
  decisions: ["Adopt the annual plan as the default offering"],
  followUps: ["Review pricing feedback in next week's sync", "Check in with legal on vendor terms"],
};

export const projectStats = (id: number) => {
  const t = sampleTasks.filter((x) => x.projectId === id);
  const done = t.filter((x) => x.status === "Done").length;
  return { total: t.length, done, pending: t.length - done, pct: t.length ? Math.round((done / t.length) * 100) : 0 };
};
