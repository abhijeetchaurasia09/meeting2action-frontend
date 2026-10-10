import { cva, type VariantProps } from "class-variance-authority";
import { AlertTriangle, Inbox, Loader2 } from "lucide-react";
import * as React from "react";
import { cn } from "@/lib/utils";

/* Buttons */
export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-card",
        secondary: "border border-input bg-card text-foreground hover:bg-muted shadow-card",
        ghost: "text-muted-foreground hover:bg-muted hover:text-foreground",
        navy: "bg-navy text-navy-foreground hover:bg-navy/90",
        inverse: "bg-navy-foreground text-navy hover:bg-navy-foreground/90",
        danger: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
      },
      size: { sm: "h-8 px-3", md: "h-9 px-4", lg: "h-11 px-6 text-[15px]", icon: "h-9 w-9" },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);
export function Button({ className, variant, size, ...p }: React.ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof buttonVariants>) {
  return <button className={cn(buttonVariants({ variant, size }), className)} {...p} />;
}

/* Cards */
export function Card({ className, ...p }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("rounded-lg border bg-card text-card-foreground shadow-card", className)} {...p} />;
}
export function CardHeader({ title, description, action }: { title: string; description?: string; action?: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b px-5 py-4">
      <div>
        <h3 className="text-sm font-semibold">{title}</h3>
        {description && <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>}
      </div>
      {action}
    </div>
  );
}
export function StatCard({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="py-1">
      <p className="text-4xl font-bold tabular-nums tracking-[-0.04em]">{value}</p>
      <p className="mt-2 text-[13px] text-muted-foreground">{label}</p>
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

/* Status badges */
const badgeVariants = cva("inline-flex items-center gap-1.5 rounded px-2 py-0.5 text-xs font-medium border", {
  variants: {
    tone: {
      neutral: "bg-muted text-muted-foreground border-border",
      info: "bg-accent text-accent-foreground border-primary/20",
      success: "bg-success/10 text-success border-success/25",
      warning: "bg-warning/10 text-warning border-warning/30",
      danger: "bg-destructive/10 text-destructive border-destructive/25",
    },
  },
  defaultVariants: { tone: "neutral" },
});
export type Tone = NonNullable<VariantProps<typeof badgeVariants>["tone"]>;
export function StatusBadge({ tone, children }: { tone?: Tone | undefined; children: React.ReactNode }) {
  return (
    <span className={badgeVariants({ tone })}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {children}
    </span>
  );
}
export const statusTone: Record<string, Tone> = {
  "To do": "neutral", "In progress": "info", Done: "success", Blocked: "danger", Overdue: "danger",
  High: "danger", Medium: "warning", Low: "neutral", Active: "info", "On hold": "warning", Completed: "success",
  Analyzed: "success", Processing: "info", Draft: "neutral",
};

/* Tables */
export function Table({ children }: { children: React.ReactNode }) {
  return <div className="overflow-x-auto"><table className="w-full text-sm">{children}</table></div>;
}
export function Th({ children, className }: { children?: React.ReactNode; className?: string }) {
  return <th className={cn("border-b bg-surface px-5 py-2.5 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground", className)}>{children}</th>;
}
export function Td({ children, className }: { children?: React.ReactNode; className?: string }) {
  return <td className={cn("border-b px-5 py-3 align-middle", className)}>{children}</td>;
}

/* Forms */
export function Label(p: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return <label className="mb-1.5 block text-sm font-medium" {...p} />;
}
const field = "w-full rounded-md border border-input bg-card px-3 text-sm shadow-card placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 focus:border-primary";
export const Input = (p: React.InputHTMLAttributes<HTMLInputElement>) => <input className={cn(field, "h-9")} {...p} />;
export const Textarea = (p: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => <textarea className={cn(field, "py-2")} {...p} />;
export const Select = (p: React.SelectHTMLAttributes<HTMLSelectElement>) => <select className={cn(field, "h-9")} {...p} />;
export function Field({ label, id, children, hint }: { label: string; id: string; children: React.ReactNode; hint?: string }) {
  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      {children}
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

/* States */
export function EmptyState({ title, description, action, icon: Icon = Inbox }: { title: string; description: string; action?: React.ReactNode; icon?: React.ComponentType<{ className?: string }> }) {
  return (
    <div className="flex flex-col items-center px-6 py-14 text-center">
      <div className="flex h-10 w-10 items-center justify-center rounded-md border bg-surface"><Icon className="h-5 w-5 text-muted-foreground" /></div>
      <h3 className="mt-4 text-sm font-semibold">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
export function LoadingState({ label = "Loading…" }: { label?: string }) {
  return (
    <div className="space-y-3 p-5" aria-busy>
      <div className="flex items-center gap-2 text-sm text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" />{label}</div>
      {[0, 1, 2].map((i) => <div key={i} className="h-9 animate-pulse rounded bg-muted" />)}
    </div>
  );
}
export function ErrorState({ title = "Something went wrong", description, onRetry }: { title?: string; description: string; onRetry?: () => void }) {
  return (
    <div className="flex items-start gap-3 rounded-md border border-destructive/25 bg-destructive/5 p-4">
      <AlertTriangle className="mt-0.5 h-4 w-4 text-destructive" />
      <div className="flex-1">
        <p className="text-sm font-medium text-destructive">{title}</p>
        <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>
      </div>
      {onRetry && <Button size="sm" variant="secondary" onClick={onRetry}>Retry</Button>}
    </div>
  );
}

export function PageHeader({ title, description, actions }: { title: string; description?: string; actions?: React.ReactNode }) {
  return (
    <div className="mb-12 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-[-0.035em] md:text-4xl">{title}</h1>
        {description && <p className="mt-2 text-[15px] text-muted-foreground">{description}</p>}
      </div>
      {actions && <div className="flex gap-2">{actions}</div>}
    </div>
  );
}

export function Logo({ inverse }: { inverse?: boolean }) {
  return (
    <span className="flex shrink-0 items-center gap-2 whitespace-nowrap">
      <span className={cn("flex h-7 min-w-9 shrink-0 items-center justify-center rounded-md px-1.5 text-[10px] font-bold tracking-tight", inverse ? "bg-navy-foreground text-navy" : "bg-navy text-navy-foreground")}>M2A</span>
      <span className={cn("text-[15px] font-semibold tracking-tight", inverse ? "text-navy-foreground" : "text-foreground")}>Meeting2Action</span>
    </span>
  );
}
