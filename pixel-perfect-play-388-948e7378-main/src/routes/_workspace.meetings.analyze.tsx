import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, CalendarClock, CheckCircle2, FileText, Gavel, Repeat, Sparkles, Users } from "lucide-react";
import { useState, type ReactNode } from "react";
import { Button, Card, EmptyState, ErrorState, Field, Input, LoadingState, PageHeader, Select, Textarea } from "@/components/kit";
import { sampleAnalysis, sampleProjects } from "@/lib/sample-data";

export const Route = createFileRoute("/_workspace/meetings/analyze")({
  head: () => ({ meta: [{ title: "Analyze meeting — Meeting2Action" }, { name: "description", content: "Paste meeting notes and extract tasks, assignees, deadlines, decisions and follow-ups." }, { property: "og:title", content: "Analyze meeting — Meeting2Action" }, { property: "og:description", content: "Turn meeting notes into structured work." }] }),
  component: Analyze,
});

type State = "empty" | "loading" | "error" | "done";

function Analyze() {
  const [notes, setNotes] = useState("");
  const [state, setState] = useState<State>("empty");

  // TODO: replace with POST to the Django analysis endpoint. Currently shows a visual preview only.
  const analyze = () => {
    setState("loading");
    setTimeout(() => setState("done"), 1200);
  };

  return (
    <>
      <Link to="/meetings" className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4" />Meetings</Link>
      <PageHeader title="Analyze meeting" description="Paste a transcript or notes and Meeting2Action will extract the work." />
      <Card>
        <form className="space-y-5 p-5" onSubmit={(e) => { e.preventDefault(); analyze(); }}>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Meeting title" id="title"><Input id="title" placeholder="Weekly product sync" /></Field>
            <Field label="Project" id="project"><Select id="project"><option>Select project</option>{sampleProjects.map((p) => <option key={p.id}>{p.name}</option>)}</Select></Field>
          </div>
          <Field label="Meeting notes" id="notes" hint="Including speaker names helps assign owners accurately.">
            <Textarea id="notes" rows={14} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder={"Priya: We need the Q4 pricing proposal finalized by Thursday.\nDaniel: I'll share the onboarding wireframes on Friday.\nMaria: Agreed — let's go with the annual plan."} />
          </Field>
          <div className="flex justify-end">
            <Button type="submit" size="lg" disabled={!notes.trim() || state === "loading"}><Sparkles className="h-4 w-4" />Analyze Meeting</Button>
          </div>
        </form>
      </Card>

      <div className="mt-6">
        {state === "empty" && <Card><EmptyState icon={FileText} title="No analysis yet" description="Enter your meeting notes above and click Analyze Meeting to see tasks, assignees, deadlines, decisions and follow-ups." /></Card>}
        {state === "loading" && <Card><LoadingState label="Analyzing meeting notes…" /></Card>}
        {state === "error" && <ErrorState title="Analysis failed" description="We couldn't analyze these notes. Please try again." onRetry={analyze} />}
        {state === "done" && (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            <Result title="Tasks" icon={<CheckCircle2 className="h-4 w-4 text-primary" />} items={sampleAnalysis.tasks} />
            <Result title="Assignees" icon={<Users className="h-4 w-4 text-primary" />} items={sampleAnalysis.assignees.map(([n, c]) => `${n} — ${c} task`)} />
            <Result title="Deadlines" icon={<CalendarClock className="h-4 w-4 text-primary" />} items={sampleAnalysis.deadlines.map(([t, d]) => `${t} · ${d}`)} />
            <Result title="Decisions" icon={<Gavel className="h-4 w-4 text-primary" />} items={sampleAnalysis.decisions} />
            <Result title="Follow-ups" icon={<Repeat className="h-4 w-4 text-primary" />} items={sampleAnalysis.followUps} />
          </div>
        )}
      </div>
    </>
  );
}

function Result({ title, icon, items }: { title: string; icon: ReactNode; items: string[] }) {
  return (
    <Card>
      <div className="flex items-center gap-2 border-b px-5 py-3.5">{icon}<h3 className="text-sm font-semibold">{title}</h3><span className="ml-auto text-xs text-muted-foreground">{items.length}</span></div>
      <ul className="divide-y">{items.map((i) => <li key={i} className="px-5 py-3 text-sm">{i}</li>)}</ul>
    </Card>
  );
}

