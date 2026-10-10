import { Link } from "@tanstack/react-router";
import { Bell, CheckSquare, FolderKanban, LayoutDashboard, LogOut, Menu, MessagesSquare, Search, Settings, X } from "lucide-react";
import { useState, type ReactNode } from "react";
import { Logo } from "@/components/kit";

const nav = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/meetings", label: "Meetings", icon: MessagesSquare },
  { to: "/tasks", label: "Tasks", icon: CheckSquare },
  { to: "/projects", label: "Projects", icon: FolderKanban },
  { to: "/notifications", label: "Notifications", icon: Bell },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

const item = "flex items-center gap-3 rounded-md px-3 py-2 text-[13px] text-muted-foreground transition-colors hover:text-foreground";

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex h-16 shrink-0 items-center px-5"><Link to="/" className="shrink-0"><Logo /></Link></div>
      <nav className="flex-1 space-y-0.5 px-3 pt-4">
        {nav.map(({ to, label, icon: Icon }) => (
          <Link key={to} to={to} onClick={onNavigate} className={item}
            activeProps={{ className: "bg-surface !text-foreground font-medium" }}>
            <Icon className="h-4 w-4" strokeWidth={1.75} />{label}
          </Link>
        ))}
      </nav>
      <div className="p-3">
        {/* TODO: call Django logout endpoint before redirecting */}
        <Link to="/login" className={item}><LogOut className="h-4 w-4" />Logout</Link>
      </div>
    </div>
  );
}

export function AppNavbar({ onMenu }: { onMenu: () => void }) {
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b bg-background/85 px-4 backdrop-blur-md sm:px-8">
      <button className="rounded-md p-2 text-muted-foreground hover:bg-muted lg:hidden" onClick={onMenu} aria-label="Open menu"><Menu className="h-5 w-5" /></button>
      <div className="relative max-w-md flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input placeholder="Search meetings, tasks, projects…" className="h-9 w-full rounded-full bg-surface pl-9 pr-4 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30" />
      </div>
      <div className="ml-auto flex items-center gap-2">
        <Link to="/notifications" className="relative rounded-full p-2 text-muted-foreground hover:bg-muted" aria-label="Notifications">
          <Bell className="h-4 w-4" /><span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-primary" />
        </Link>
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-navy text-[11px] font-semibold text-navy-foreground">AC</div>
      </div>
    </header>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 hidden w-60 border-r bg-background lg:block"><Sidebar /></aside>
      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-navy/30" onClick={() => setOpen(false)} />
          <aside className="relative h-full w-64 border-r bg-background">
            <button className="absolute right-3 top-5 text-muted-foreground" onClick={() => setOpen(false)} aria-label="Close menu"><X className="h-4 w-4" /></button>
            <Sidebar onNavigate={() => setOpen(false)} />
          </aside>
        </div>
      )}
      <div className="lg:pl-60">
        <AppNavbar onMenu={() => setOpen(true)} />
        <main className="mx-auto max-w-6xl px-4 py-10 sm:px-8 lg:py-14">{children}</main>
      </div>
    </div>
  );
}

export function ProgressBar({ pct }: { pct: number }) {
  return <div className="h-1 rounded-full bg-muted"><div className="h-full rounded-full bg-foreground" style={{ width: `${pct}%` }} /></div>;
}
