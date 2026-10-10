import { createFileRoute, Link } from "@tanstack/react-router";
import { Lightbulb, Plus } from "lucide-react";
import { ProgressBar } from "@/components/app/AppShell";
import { buttonVariants, Card, CardHeader, PageHeader, StatCard, StatusBadge, statusTone, Table, Td, Th } from "@/components/kit";
import { projectStats, sampleMeetings, sampleProjects, sampleTasks } from "@/lib/sample-data";

export const Route = createFileRoute("/_workspace/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — Meeting2Action" }, { name: "description", content: "Overview of your meetings, tasks and projects." }, { property: "og:title", content: "Dashboard — Meeting2Action" }, { property: "og:description", content: "Overview of your meetings, tasks and projects." }] }),
  component: Dashboard,
});

function Dashboard() {
  const done = sampleTasks.filter((t) => t.status === "Done").length;
  return (
    <>
      <PageHeader title="Welcome back, Abhijeet" description="Here's what's moving across your workspace."
        actions={<Link to="/meetings/analyze" className={buttonVariants()}><Plus className="h-4 w-4" />Analyze meeting</Link>} />
      <div className="grid grid-cols-2 gap-x-8 gap-y-8 border-y py-8 sm:grid-cols-3 xl:grid-cols-5">
        <StatCard label="Total meetings" value={String(sampleMeetings.length)} />
        <StatCard label="Total tasks" value={String(sampleTasks.length)} />
        <StatCard label="Pending tasks" value={String(sampleTasks.length - done)} />
        <StatCard label="Completed tasks" value={String(done)} />
        <StatCard label="Active projects" value={String(sampleProjects.filter((p) => p.status === "Active").length)} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader title="Recent tasks" action={<Link to="/tasks" className="text-sm font-medium text-primary">View all</Link>} />
          <Table>
            <thead><tr><Th>Task</Th><Th>Assignee</Th><Th>Due</Th><Th>Status</Th></tr></thead>
            <tbody>{sampleTasks.slice(0, 5).map((t) => (
              <tr key={t.id}><Td className="font-medium">{t.title}</Td><Td className="text-muted-foreground">{t.assignee}</Td><Td className="whitespace-nowrap text-muted-foreground">{t.due}</Td><Td><StatusBadge tone={statusTone[t.status]}>{t.status}</StatusBadge></Td></tr>
            ))}</tbody>
          </Table>
        </Card>
        <Card>
          <CardHeader title="Recent meetings" action={<Link to="/meetings" className="text-sm font-medium text-primary">View all</Link>} />
          <ul className="divide-y">{sampleMeetings.map((m) => (
            <li key={m.id}>
              <Link to="/meetings/$meetingId" params={{ meetingId: String(m.id) }} className="block px-5 py-3.5 hover:bg-surface">
                <p className="text-sm font-medium">{m.title}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{m.date} · {sampleTasks.filter((t) => t.meetingId === m.id).length} tasks</p>
              </Link>
            </li>
          ))}</ul>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader title="Project progress" />
          <ul className="divide-y">{sampleProjects.map((p) => {
            const s = projectStats(p.id);
            return (
              <li key={p.id} className="px-5 py-4">
                <div className="mb-2 flex justify-between text-sm"><span className="font-medium">{p.name}</span><span className="text-muted-foreground">{s.done}/{s.total} · {s.pct}%</span></div>
                <ProgressBar pct={s.pct} />
              </li>
            );
          })}</ul>
        </Card>
        <Card>
          <CardHeader title="AI insights" description="Patterns from recent meetings" />
          <ul className="space-y-4 p-5">
            {["Revenue Ops has 2 high-priority tasks due within a week.", "1 task is overdue — consider reassigning or extending the deadline.", "Product Design meetings produce the most follow-ups."].map((t) => (
              <li key={t} className="flex gap-3 text-sm"><Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-primary" /><span className="text-muted-foreground">{t}</span></li>
            ))}
          </ul>
        </Card>
      </div>
    </>
  );
}
