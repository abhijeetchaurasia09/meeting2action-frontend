import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Bell, Check } from "lucide-react";
import { useEffect, useState } from "react";
import { buttonVariants, Logo } from "@/components/kit";
import { useReveal } from "@/hooks/use-reveal";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Meeting2Action — From Discussion to Done" },
      { name: "description", content: "Meeting2Action turns meeting conversations into clear tasks, owners, deadlines, decisions and follow-ups — automatically." },
      { property: "og:title", content: "Meeting2Action — From Discussion to Done" },
      { property: "og:description", content: "Turn meeting conversations into tasks, owners, deadlines and decisions." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

const links = [["Features", "#features"], ["How It Works", "#how"], ["Use Cases", "#use-cases"], ["About", "#about"]];

const steps = [
  ["Capture the conversation", "Paste notes or upload a transcript from any meeting tool."],
  ["AI understands the discussion", "Speakers, commitments, dates and agreements are recognised in context."],
  ["Actions are extracted", "Tasks, owners, deadlines and decisions appear — structured and ready."],
  ["Your team gets work done", "Review, assign and track everything in one calm workspace."],
];

function Landing() {
  useReveal();
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 8);
    on(); window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  return (
    <div className="bg-background text-foreground">
      <header className={cn("sticky top-0 z-30 transition-all duration-500", scrolled ? "border-b bg-background/85 backdrop-blur-md" : "border-b border-transparent bg-background")}>
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link to="/" className="shrink-0"><Logo /></Link>
          <nav className="hidden gap-9 md:flex">{links.map(([l, h]) => <a key={h} href={h} className="text-[13px] text-muted-foreground transition-colors hover:text-foreground">{l}</a>)}</nav>
          <div className="flex items-center gap-1">
            <Link to="/login" className={buttonVariants({ variant: "ghost", size: "sm" })}>Sign In</Link>
            <Link to="/signup" className={cn(buttonVariants({ size: "sm" }), "rounded-full px-4")}>Get Started</Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 pb-24 pt-24 text-center md:pb-32 md:pt-40">
        <p className="reveal text-xs font-semibold uppercase tracking-[0.25em] text-primary">AI Work Assistant</p>
        <h1 className="reveal mt-6 text-[3.25rem] font-bold leading-[0.95] tracking-[-0.045em] sm:text-7xl md:text-8xl lg:text-[8.5rem]">
          From discussion<br /><span className="text-muted-foreground/60">to done.</span>
        </h1>
        <p className="reveal mx-auto mt-10 max-w-xl text-lg leading-relaxed text-muted-foreground md:text-xl">
          Meeting2Action turns meeting conversations into clear tasks, owners, deadlines, decisions and follow-ups — automatically.
        </p>
        <div className="reveal mt-12 flex flex-wrap items-center justify-center gap-6">
          <Link to="/signup" className={cn(buttonVariants({ size: "lg" }), "group rounded-full px-7 transition-transform active:scale-[0.98]")}>
            Get Started <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <a href="#how" className="group inline-flex items-center gap-1 text-[15px] font-medium text-primary">
            See How It Works <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </a>
        </div>
      </section>

      {/* Product visual */}
      <section className="px-4 pb-32 sm:px-6">
        <div className="reveal mx-auto max-w-6xl rounded-[28px] bg-surface p-6 sm:p-10 md:p-16">
          <div className="grid items-center gap-10 lg:grid-cols-[1fr_auto_1.15fr] lg:gap-6">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">Meeting notes</p>
              <div className="mt-6 space-y-5 text-[15px] leading-relaxed">
                {[["Priya", "Let's lock the Q4 pricing proposal by Thursday."], ["Daniel", "I'll send the onboarding wireframes Friday."], ["Maria", "Agreed — we go with the annual plan."]].map(([n, t]) => (
                  <p key={n}><span className="font-semibold">{n}</span><br /><span className="text-muted-foreground">{t}</span></p>
                ))}
              </div>
            </div>
            <div className="flex flex-col items-center gap-3 py-2 lg:px-6">
              <span className="h-10 w-px bg-border lg:h-px lg:w-10" />
              <span className="rounded-full border bg-background px-4 py-1.5 text-xs font-medium"><span className="mr-2 inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-primary align-middle" />AI Analysis</span>
              <span className="h-10 w-px bg-border lg:h-px lg:w-10" />
            </div>
            <div className="rounded-2xl bg-background p-2 shadow-[0_30px_60px_-30px_rgb(17_17_17/0.18)]">
              {[["Finalize Q4 pricing proposal", "Priya", "Thu, Oct 8", "Task"], ["Send onboarding wireframes", "Daniel", "Fri, Oct 9", "Task"], ["Adopt annual plan", "Team", "Agreed", "Decision"]].map(([t, a, d, k], i) => (
                <div key={t} className={cn("flex items-center justify-between gap-4 px-4 py-4", i > 0 && "border-t")}>
                  <div className="flex items-start gap-3">
                    <span className={cn("mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border", k === "Decision" && "border-primary bg-primary text-primary-foreground")}>{k === "Decision" && <Check className="h-3 w-3" />}</span>
                    <div><p className="text-sm font-medium">{t}</p><p className="mt-0.5 text-xs text-muted-foreground">{a} · {d}</p></div>
                  </div>
                  <span className={cn("text-[11px] font-medium uppercase tracking-wider", k === "Decision" ? "text-primary" : "text-muted-foreground")}>{k}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="scroll-mt-16 border-t py-28 md:py-40">
        <div className="mx-auto max-w-6xl px-6">
          <p className="reveal text-xs font-semibold uppercase tracking-[0.25em] text-primary">How it works</p>
          <h2 className="reveal mt-5 max-w-3xl text-4xl font-bold leading-[1.05] md:text-6xl">Four steps. Zero follow-up anxiety.</h2>
          <div className="mt-20 divide-y border-y">
            {steps.map(([t, d], i) => (
              <div key={t} className="reveal grid gap-4 py-10 md:grid-cols-[120px_1fr_1fr] md:items-baseline md:py-12">
                <span className="text-sm font-medium tabular-nums text-muted-foreground">Step {String(i + 1).padStart(2, "0")}</span>
                <h3 className="text-2xl font-semibold md:text-4xl">{t}</h3>
                <p className="max-w-md leading-relaxed text-muted-foreground md:justify-self-end">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="scroll-mt-16 bg-surface py-28 md:py-40">
        <div className="mx-auto max-w-6xl space-y-32 px-6 md:space-y-44">
          <Feature eyebrow="Extraction" title="Automatic task extraction." text="Every commitment said aloud becomes a clear, trackable task — worded precisely, never lost in the notes." visual={<TaskVisual />} />
          <Feature flip eyebrow="Ownership" title="Assign & track action items." text="Owners are identified from who said what. Status, priority and due dates stay visible to everyone." visual={<OwnerVisual />} />
          <Feature eyebrow="Insight" title="Project progress, at a glance." text="See how each project is moving, which meetings drive the most work, and where things are slipping." visual={<ProgressVisual />} />
          <Feature flip eyebrow="Follow-ups" title="Never miss a follow-up." text="Gentle reminders before deadlines and after meetings keep work moving long after the call ends." visual={<FollowVisual />} />
        </div>
      </section>

      {/* Use cases */}
      <section id="use-cases" className="scroll-mt-16 py-28 md:py-40">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="reveal max-w-2xl text-4xl font-bold leading-[1.05] md:text-6xl">Built for teams that meet often.</h2>
          <div className="mt-20 grid gap-x-12 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
            {[["Product teams", "Sprint planning and roadmap reviews."], ["Leadership", "Executive syncs with clear decisions."], ["Client services", "Turn client calls into deliverables."], ["Operations", "Cross-team standups and vendor reviews."]].map(([t, d]) => (
              <div key={t} className="reveal border-t border-foreground pt-6"><h3 className="text-lg font-semibold">{t}</h3><p className="mt-2 leading-relaxed text-muted-foreground">{d}</p></div>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="scroll-mt-16 border-t py-28 md:py-40">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <p className="reveal text-xs font-semibold uppercase tracking-[0.25em] text-primary">About</p>
          <p className="reveal mt-8 text-2xl font-medium leading-snug md:text-4xl">Too much work is agreed in meetings and forgotten afterwards. <span className="text-muted-foreground">Meeting2Action closes that gap — a reliable record of who owns what, and by when.</span></p>
        </div>
      </section>

      {/* CTA */}
      <section id="contact" className="bg-navy py-28 text-center md:py-36">
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="reveal text-4xl font-bold leading-[1.05] text-navy-foreground md:text-6xl">Make your next meeting count.</h2>
          <p className="reveal mt-6 text-navy-foreground/60">Questions? hello@meeting2action.com</p>
          <Link to="/signup" className={cn(buttonVariants({ variant: "inverse", size: "lg" }), "reveal mt-10 rounded-full px-7 active:scale-[0.98]")}>Get Started</Link>
        </div>
      </section>

      <footer className="py-10">
        <div className="mx-auto flex max-w-6xl flex-col justify-between gap-4 px-6 text-xs text-muted-foreground sm:flex-row sm:items-center">
          <Logo />
          <p>© 2026 Meeting2Action. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

function Feature({ eyebrow, title, text, visual, flip }: { eyebrow: string; title: string; text: string; visual: React.ReactNode; flip?: boolean }) {
  return (
    <div className="grid items-center gap-12 md:grid-cols-2 md:gap-20">
      <div className={cn("reveal", flip && "md:order-2")}>
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">{eyebrow}</p>
        <h3 className="mt-5 text-4xl font-bold leading-[1.05] md:text-5xl">{title}</h3>
        <p className="mt-6 max-w-md text-lg leading-relaxed text-muted-foreground">{text}</p>
      </div>
      <div className={cn("reveal", flip && "md:order-1")}>{visual}</div>
    </div>
  );
}

const panel = "rounded-3xl bg-background p-8 md:p-10";

function TaskVisual() {
  return (
    <div className={panel}>
      <p className="text-sm leading-relaxed text-muted-foreground">"…and <span className="rounded bg-accent px-1 text-accent-foreground">Daniel will send the wireframes by Friday</span>, then we review."</p>
      <div className="mt-8 flex items-center gap-3 border-t pt-6"><span className="h-5 w-5 rounded-full border" /><p className="text-sm font-medium">Send onboarding wireframes</p><span className="ml-auto text-xs text-muted-foreground">Fri</span></div>
    </div>
  );
}
function OwnerVisual() {
  return (
    <div className={cn(panel, "space-y-5")}>
      {[["PR", "Priya", "In progress"], ["DA", "Daniel", "To do"], ["MA", "Maria", "Done"]].map(([i, n, s]) => (
        <div key={n} className="flex items-center gap-4"><span className="flex h-9 w-9 items-center justify-center rounded-full bg-surface text-xs font-semibold">{i}</span><span className="text-sm font-medium">{n}</span><span className={cn("ml-auto text-xs", s === "Done" ? "text-primary" : "text-muted-foreground")}>{s}</span></div>
      ))}
    </div>
  );
}
function ProgressVisual() {
  return (
    <div className={cn(panel, "space-y-7")}>
      {[["Revenue Ops", 72], ["Product Design", 45], ["Onboarding", 90]].map(([n, p]) => (
        <div key={n}><div className="mb-2 flex justify-between text-sm"><span className="font-medium">{n}</span><span className="tabular-nums text-muted-foreground">{p}%</span></div><div className="h-1 rounded-full bg-surface"><div className="h-full rounded-full bg-foreground" style={{ width: `${p}%` }} /></div></div>
      ))}
    </div>
  );
}
function FollowVisual() {
  return (
    <div className={panel}>
      <div className="flex items-start gap-4"><Bell className="mt-0.5 h-5 w-5 text-primary" /><div><p className="text-sm font-medium">Q4 pricing proposal is due tomorrow</p><p className="mt-1 text-xs text-muted-foreground">From Pricing sync · assigned to Priya</p></div></div>
    </div>
  );
}
