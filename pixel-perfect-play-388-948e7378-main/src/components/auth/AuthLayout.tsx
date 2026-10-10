import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { Card, Logo } from "@/components/kit";

export function AuthLayout({ title, subtitle, children, footer }: { title: string; subtitle: string; children: ReactNode; footer: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-surface px-4 py-12">
      <Link to="/" className="mb-8"><Logo /></Link>
      <Card className="w-full max-w-sm p-8">
        <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
        <div className="mt-6">{children}</div>
      </Card>
      <p className="mt-6 text-sm text-muted-foreground">{footer}</p>
    </div>
  );
}
