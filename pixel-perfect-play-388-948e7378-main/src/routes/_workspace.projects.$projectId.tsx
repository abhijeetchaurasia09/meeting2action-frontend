import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { ProgressBar } from "@/components/app/AppShell";
import { Card, CardHeader, EmptyState, PageHeader, StatCard, StatusBadge, statusTone, Table, Td, Th } from "@/components/kit";
import { projectStats, sampleProjects, sampleTasks } from "@/lib/sample-data";

export const Route = createFileRoute("/_workspace/projects/$projectId")({
  head: () => ({ meta: [{ title: "Project details — Meeting2Action" }, { name: "description", content: "Progress and tasks for a project." }, { property: "og:title", content: "Project details — Meeting2Action" }, { property: "og:description", content: "Progress and tasks for a project." }] }),
  component: ProjectDetail,
});

function ProjectDetail() {
  const { projectId } = Route.useParams();
  const p = sampleProjects.find((x) => String(x.id) === projectId);
  const back = <Link to="/projects" className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4" />Projects</Link>;
  if (!p) return <>{back}<Card><EmptyState title="Project not found" description="It may have been removed." /></Card></>;
  const s = projectStats(p.id);
  const tasks = sampleTasks.filter((t) => t.projectId === p.id);
  return (
    <>
      {back}
      <PageHeader title={p.name} description={`${p.description} Owner · ${p.owner}`} actions={<StatusBadge tone={statusTone[p.status]}>{p.status}</StatusBadge>} />
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Total tasks" value={String(s.total)} /><StatCard label="Completed" value={String(s.done)} /><StatCard label="Pending" value={String(s.pending)} />
      </div>
      <Card className="mt-6 p-5"><div className="mb-2 flex justify-between text-sm"><span className="font-medium">Overall progress</span><span className="text-muted-foreground">{s.pct}%</span></div><ProgressBar pct={s.pct} /></Card>
      <Card className="mt-6">
        <CardHeader title="Tasks" />
        {tasks.length ? (
          <Table>
            <thead><tr><Th>Task</Th><Th>Assignee</Th><Th>Due</Th><Th>Priority</Th><Th>Status</Th></tr></thead>
            <tbody>{tasks.map((t) => <tr key={t.id}><Td className="font-medium">{t.title}</Td><Td>{t.assignee}</Td><Td className="whitespace-nowrap text-muted-foreground">{t.due}</Td><Td><StatusBadge tone={statusTone[t.priority]}>{t.priority}</StatusBadge></Td><Td><StatusBadge tone={statusTone[t.status]}>{t.status}</StatusBadge></Td></tr>)}</tbody>
          </Table>
        ) : <EmptyState title="No tasks yet" description="Tasks from analyzed meetings will appear here." />}
      </Card>
    </>
  );
}
