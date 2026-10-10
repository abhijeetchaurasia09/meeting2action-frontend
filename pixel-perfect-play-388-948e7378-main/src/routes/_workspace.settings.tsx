import { createFileRoute } from "@tanstack/react-router";
import { Button, Card, CardHeader, Field, Input, PageHeader } from "@/components/kit";

export const Route = createFileRoute("/_workspace/settings")({
  head: () => ({ meta: [{ title: "Settings — Meeting2Action" }, { name: "description", content: "Manage your Meeting2Action profile." }, { property: "og:title", content: "Settings — Meeting2Action" }, { property: "og:description", content: "Manage your Meeting2Action profile." }] }),
  component: Settings,
});

function Settings() {
  return (
    <>
      <PageHeader title="Settings" description="Manage your profile and password." />
      <div className="max-w-2xl space-y-6">
        <Card>
          <CardHeader title="Profile" />
          <form className="space-y-4 p-5" onSubmit={(e) => e.preventDefault()}>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Full name" id="s-name"><Input id="s-name" defaultValue="Abhijeet Chaurasia" /></Field>
              <Field label="Email" id="s-email"><Input id="s-email" type="email" /></Field>
            </div>
            <div className="flex justify-end"><Button type="submit">Save profile</Button></div>
          </form>
        </Card>
        <Card>
          <CardHeader title="Password" />
          <form className="space-y-4 p-5" onSubmit={(e) => e.preventDefault()}>
            <Field label="Current password" id="s-cur"><Input id="s-cur" type="password" /></Field>
            <Field label="New password" id="s-new"><Input id="s-new" type="password" /></Field>
            <div className="flex justify-end"><Button type="submit">Update password</Button></div>
          </form>
        </Card>
      </div>
    </>
  );
}
