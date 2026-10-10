import { createFileRoute } from "@tanstack/react-router";
import { CalendarClock, UserPlus } from "lucide-react";
import { useState } from "react";
import { Button, Card, EmptyState, PageHeader } from "@/components/kit";
import { cn } from "@/lib/utils";
import { sampleNotifications } from "@/lib/sample-data";

export const Route = createFileRoute("/_workspace/notifications")({
  head: () => ({ meta: [{ title: "Notifications — Meeting2Action" }, { name: "description", content: "Task assignments and deadline reminders." }, { property: "og:title", content: "Notifications — Meeting2Action" }, { property: "og:description", content: "Task assignments and deadline reminders." }] }),
  component: Notifications,
});

function Notifications() {
  const [items, setItems] = useState(sampleNotifications);
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const shown = items.filter((n) => filter === "all" || n.unread);
  const toggle = (id: number) => setItems((xs) => xs.map((n) => (n.id === id ? { ...n, unread: !n.unread } : n)));

  return (
    <>
      <PageHeader title="Notifications" description="Task assignments and deadline reminders."
        actions={<Button variant="secondary" onClick={() => setItems((xs) => xs.map((n) => ({ ...n, unread: false })))}>Mark all as read</Button>} />
      <div className="mb-4 flex gap-1">
        {(["all", "unread"] as const).map((f) => (
          <Button key={f} size="sm" variant={filter === f ? "navy" : "ghost"} onClick={() => setFilter(f)}>{f === "all" ? "All" : `Unread (${items.filter((n) => n.unread).length})`}</Button>
        ))}
      </div>
      <Card>
        {shown.length ? (
          <ul className="divide-y">{shown.map((n) => {
            const Icon = n.type === "deadline" ? CalendarClock : UserPlus;
            return (
              <li key={n.id} className={cn("flex items-start gap-4 px-5 py-4", n.unread && "bg-accent/40")}>
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border bg-card"><Icon className="h-4 w-4 text-primary" /></div>
                <div className="min-w-0 flex-1">
                  <p className={cn("text-sm", n.unread ? "font-semibold" : "text-muted-foreground")}>{n.title}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{n.meta} · {n.time}</p>
                </div>
                <div className="flex items-center gap-3">
                  {n.unread && <span className="h-2 w-2 rounded-full bg-primary" aria-label="Unread" />}
                  <button onClick={() => toggle(n.id)} className="whitespace-nowrap text-xs font-medium text-primary">{n.unread ? "Mark read" : "Mark unread"}</button>
                </div>
              </li>
            );
          })}</ul>
        ) : <EmptyState title="You're all caught up" description="No unread notifications." />}
      </Card>
    </>
  );
}
