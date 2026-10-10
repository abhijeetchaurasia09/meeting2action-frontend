import { createFileRoute, Link } from "@tanstack/react-router";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { Button, Field, Input } from "@/components/kit";

export const Route = createFileRoute("/signup")({
  head: () => ({ meta: [{ title: "Create account — Meeting2Action" }, { name: "description", content: "Start turning meetings into action with Meeting2Action." }, { property: "og:title", content: "Create account — Meeting2Action" }, { property: "og:description", content: "Start turning meetings into action." }] }),
  component: Signup,
});

function Signup() {
  return (
    <AuthLayout title="Create your account" subtitle="From discussion to done, in minutes."
      footer={<>Already have an account? <Link to="/login" className="font-medium text-primary">Sign in</Link></>}>
      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
        <Field label="Full name" id="name"><Input id="name" /></Field>
        <Field label="Work email" id="email"><Input id="email" type="email" placeholder="you@company.com" /></Field>
        <Field label="Password" id="password" hint="At least 8 characters."><Input id="password" type="password" /></Field>
        <Button type="submit" className="w-full">Create account</Button>
      </form>
    </AuthLayout>
  );
}
