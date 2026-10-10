import { createFileRoute, Link } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { ProgressBar } from "@/components/app/AppShell";
import { Button, Card, PageHeader, StatusBadge, statusTone } from "@/components/kit";
import { projectStats, sampleProjects } from "@/lib/sample-data";

export const Route = createFileRoute("/_workspace/projects/")({
  head: () => ({ meta: [{ title: "Projects — Meeting2Action" }, { name: "description", content: "Track progress across projects fed by your meetings." }, { property: "og:title", content: "Projects — Meeting2Action" }, { property: "og:description", content: "Track progress across projects." }] }),
  component: Projects,
});

function Projects() {
  return (
    <>
      <PageHeader title="Projects" description="Group meetings and tasks by initiative." actions={<Button><Plus className="h-4 w-4" />New project</Button>} />
      <div className="grid gap-4 md:grid-cols-2">
        {sampleProjects.map((p) => {
          const s = projectStats(p.id);
          return (
            <Link key={p.id} to="/projects/$projectId" params={{ projectId: String(p.id) }}>
              <Card className="h-full p-5 transition-colors hover:border-primary/40">
                <div className="flex items-start justify-between gap-3">
                  <div><h3 className="font-semibold">{p.name}</h3><p className="mt-0.5 text-sm text-muted-foreground">{p.description}</p></div>
                  <StatusBadge tone={statusTone[p.status]}>{p.status}</StatusBadge>
                </div>
                <dl className="mt-6 grid grid-cols-3 gap-3 text-sm">
                  <div><dt className="text-muted-foreground">Tasks</dt><dd className="mt-0.5 font-semibold">{s.total}</dd></div>
                  <div><dt className="text-muted-foreground">Completed</dt><dd className="mt-0.5 font-semibold">{s.done}</dd></div>
                  <div><dt className="text-muted-foreground">Pending</dt><dd className="mt-0.5 font-semibold">{s.pending}</dd></div>
                </dl>
                <div className="mt-5 mb-2 flex justify-between text-xs text-muted-foreground"><span>Progress</span><span>{s.pct}%</span></div>
                <ProgressBar pct={s.pct} />
              </Card>
            </Link>
          );
        })}
      </div>
    </>
  );
}
