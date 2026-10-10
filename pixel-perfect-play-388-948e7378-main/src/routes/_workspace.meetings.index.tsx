import { createFileRoute, Link } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { buttonVariants, Card, PageHeader, StatusBadge, statusTone, Table, Td, Th } from "@/components/kit";
import { sampleMeetings, sampleTasks } from "@/lib/sample-data";

export const Route = createFileRoute("/_workspace/meetings/")({
  head: () => ({ meta: [{ title: "Meetings — Meeting2Action" }, { name: "description", content: "History of analyzed meetings and the work they produced." }, { property: "og:title", content: "Meetings — Meeting2Action" }, { property: "og:description", content: "History of analyzed meetings." }] }),
  component: Meetings,
});

function Meetings() {
  return (
    <>
      <PageHeader title="Meetings" description="Every analyzed meeting and the work it produced."
        actions={<Link to="/meetings/analyze" className={buttonVariants()}><Plus className="h-4 w-4" />Analyze meeting</Link>} />
      <Card>
        <Table>
          <thead><tr><Th>Meeting</Th><Th>Date</Th><Th>Status</Th><Th>Extracted tasks</Th><Th className="text-right">{""}</Th></tr></thead>
          <tbody>{sampleMeetings.map((m) => (
            <tr key={m.id} className="hover:bg-surface">
              <Td className="font-medium">{m.title}</Td><Td className="whitespace-nowrap text-muted-foreground">{m.date}</Td>
              <Td><StatusBadge tone={statusTone[m.status]}>{m.status}</StatusBadge></Td>
              <Td>{sampleTasks.filter((t) => t.meetingId === m.id).length}</Td>
              <Td className="text-right"><Link to="/meetings/$meetingId" params={{ meetingId: String(m.id) }} className="text-sm font-medium text-primary">View details</Link></Td>
            </tr>
          ))}</tbody>
        </Table>
      </Card>
    </>
  );
}
