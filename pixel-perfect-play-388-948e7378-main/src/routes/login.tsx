import { createFileRoute, Link } from "@tanstack/react-router";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { Button, Field, Input } from "@/components/kit";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Sign in — Meeting2Action" }, { name: "description", content: "Sign in to your Meeting2Action workspace." }, { property: "og:title", content: "Sign in — Meeting2Action" }, { property: "og:description", content: "Sign in to your Meeting2Action workspace." }] }),
  component: Login,
});

function Login() {
  return (
    <AuthLayout title="Sign in" subtitle="Welcome back to Meeting2Action."
      footer={<>No account? <Link to="/signup" className="font-medium text-primary">Create one</Link></>}>
      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
        <Field label="Work email" id="email"><Input id="email" type="email" placeholder="you@company.com" /></Field>
        <Field label="Password" id="password"><Input id="password" type="password" /></Field>
        <Button type="submit" className="w-full">Sign in</Button>
      </form>
    </AuthLayout>
  );
}
