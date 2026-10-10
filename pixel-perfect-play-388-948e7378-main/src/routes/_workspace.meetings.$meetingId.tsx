import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { Card, CardHeader, EmptyState, PageHeader, StatusBadge, statusTone, Table, Td, Th } from "@/components/kit";
import { sampleMeetings, sampleTasks } from "@/lib/sample-data";

export const Route = createFileRoute("/_workspace/meetings/$meetingId")({
  head: () => ({ meta: [{ title: "Meeting details — Meeting2Action" }, { name: "description", content: "Summary, decisions and tasks from a meeting." }, { property: "og:title", content: "Meeting details — Meeting2Action" }, { property: "og:description", content: "Summary, decisions and tasks from a meeting." }] }),
  component: MeetingDetail,
});

function MeetingDetail() {
  const { meetingId } = Route.useParams();
  const m = sampleMeetings.find((x) => String(x.id) === meetingId);
  const back = <Link to="/meetings" className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4" />Meetings</Link>;
  if (!m) return <>{back}<Card><EmptyState title="Meeting not found" description="It may have been removed." /></Card></>;
  const tasks = sampleTasks.filter((t) => t.meetingId === m.id);
  return (
    <>
      {back}
      <PageHeader title={m.title} description={`${m.date} · ${m.attendees.join(", ")}`} actions={<StatusBadge tone={statusTone[m.status]}>{m.status}</StatusBadge>} />
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader title="Extracted tasks" />
          {tasks.length ? (
            <Table>
              <thead><tr><Th>Task</Th><Th>Assignee</Th><Th>Due</Th><Th>Status</Th></tr></thead>
              <tbody>{tasks.map((t) => <tr key={t.id}><Td className="font-medium">{t.title}</Td><Td>{t.assignee}</Td><Td className="whitespace-nowrap text-muted-foreground">{t.due}</Td><Td><StatusBadge tone={statusTone[t.status]}>{t.status}</StatusBadge></Td></tr>)}</tbody>
            </Table>
          ) : <EmptyState title="No tasks extracted" description="This meeting is still being processed." />}
        </Card>
        <div className="space-y-6">
          <Card><CardHeader title="Summary" /><p className="p-5 text-sm leading-relaxed text-muted-foreground">{m.summary}</p></Card>
          <Card>
            <CardHeader title="Decisions" />
            {m.decisions.length ? <ul className="space-y-2 p-5 text-sm">{m.decisions.map((d) => <li key={d}>• {d}</li>)}</ul> : <p className="p-5 text-sm text-muted-foreground">No decisions recorded.</p>}
          </Card>
        </div>
      </div>
    </>
  );
}
