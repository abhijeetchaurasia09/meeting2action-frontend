import { createFileRoute } from "@tanstack/react-router";
import { Plus, Search, X } from "lucide-react";
import { useMemo, useState } from "react";
import { Button, Card, EmptyState, Field, Input, PageHeader, Select, StatusBadge, statusTone, Table, Td, Textarea, Th } from "@/components/kit";
import { sampleProjects, sampleTasks, type Task } from "@/lib/sample-data";

export const Route = createFileRoute("/_workspace/tasks")({
  head: () => ({ meta: [{ title: "Tasks — Meeting2Action" }, { name: "description", content: "Manage every action item extracted from your meetings." }, { property: "og:title", content: "Tasks — Meeting2Action" }, { property: "og:description", content: "Manage every action item extracted from your meetings." }] }),
  component: Tasks,
});

const statuses = ["To do", "In progress", "Done", "Overdue"];
const priorities = ["High", "Medium", "Low"];

function Tasks() {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [project, setProject] = useState("");
  const [selected, setSelected] = useState<Task | null>(null);

  const rows = useMemo(() => sampleTasks.filter((t) =>
    (!q || `${t.title} ${t.assignee}`.toLowerCase().includes(q.toLowerCase())) &&
    (!status || t.status === status) && (!priority || t.priority === priority) && (!project || t.project === project)), [q, status, priority, project]);

  return (
    <>
      <PageHeader title="Tasks" description="Every action item, its owner and its deadline." actions={<Button><Plus className="h-4 w-4" />New task</Button>} />
      <Card>
        <div className="grid gap-3 border-b p-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="relative"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search tasks…" className="h-9 w-full rounded-md border border-input bg-card pl-9 pr-3 text-sm shadow-card focus:outline-none focus:ring-2 focus:ring-ring/30" /></div>
          <Select value={status} onChange={(e) => setStatus(e.target.value)}><option value="">All statuses</option>{statuses.map((s) => <option key={s}>{s}</option>)}</Select>
          <Select value={priority} onChange={(e) => setPriority(e.target.value)}><option value="">All priorities</option>{priorities.map((s) => <option key={s}>{s}</option>)}</Select>
          <Select value={project} onChange={(e) => setProject(e.target.value)}><option value="">All projects</option>{sampleProjects.map((p) => <option key={p.id}>{p.name}</option>)}</Select>
        </div>
        {rows.length ? (
          <Table>
            <thead><tr><Th>Task</Th><Th>Assignee</Th><Th>Project</Th><Th>Due date</Th><Th>Status</Th><Th>Priority</Th></tr></thead>
            <tbody>{rows.map((t) => (
              <tr key={t.id} onClick={() => setSelected(t)} className="cursor-pointer hover:bg-surface">
                <Td className="font-medium">{t.title}</Td><Td>{t.assignee}</Td><Td className="text-muted-foreground">{t.project}</Td><Td className="whitespace-nowrap text-muted-foreground">{t.due}</Td>
                <Td><StatusBadge tone={statusTone[t.status]}>{t.status}</StatusBadge></Td><Td><StatusBadge tone={statusTone[t.priority]}>{t.priority}</StatusBadge></Td>
              </tr>
            ))}</tbody>
          </Table>
        ) : <EmptyState title="No tasks match" description="Try adjusting your search or filters." />}
      </Card>
      {selected && <TaskPanel task={selected} onClose={() => setSelected(null)} />}
    </>
  );
}

function TaskPanel({ task, onClose }: { task: Task; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-navy/40" onClick={onClose} />
      <aside className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col border-l bg-card">
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h2 className="font-semibold">Task details</h2>
          <button onClick={onClose} className="rounded-md p-1.5 text-muted-foreground hover:bg-muted" aria-label="Close"><X className="h-4 w-4" /></button>
        </div>
        {/* TODO: submit to Django task update endpoint */}
        <form key={task.id} className="flex-1 space-y-4 overflow-y-auto p-6" onSubmit={(e) => { e.preventDefault(); onClose(); }}>
          <Field label="Title" id="t-title"><Input id="t-title" defaultValue={task.title} /></Field>
          <Field label="Description" id="t-desc"><Textarea id="t-desc" rows={4} defaultValue={task.description} /></Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Assignee" id="t-as"><Input id="t-as" defaultValue={task.assignee} /></Field>
            <Field label="Due date" id="t-due"><Input id="t-due" defaultValue={task.due} /></Field>
            <Field label="Status" id="t-st"><Select id="t-st" defaultValue={task.status}>{statuses.map((s) => <option key={s}>{s}</option>)}</Select></Field>
            <Field label="Priority" id="t-pr"><Select id="t-pr" defaultValue={task.priority}>{priorities.map((s) => <option key={s}>{s}</option>)}</Select></Field>
          </div>
          <Field label="Project" id="t-pj"><Select id="t-pj" defaultValue={task.project}>{sampleProjects.map((p) => <option key={p.id}>{p.name}</option>)}</Select></Field>
          <div className="flex justify-end gap-2 border-t pt-4">
            <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
            <Button type="submit">Save changes</Button>
          </div>
        </form>
      </aside>
    </div>
  );
}
