import type { Metadata } from "next";

import { AuthShell } from "@/features/auth/components/auth-shell";
import { LoginForm } from "@/features/auth/components/login-form";

export const metadata: Metadata = {
  title: "Sign in",
  robots: { index: false },
};

const messages: Record<string, string> = {
  signed_out: "You have been signed out.",
  password_updated: "Password updated. Sign in with your new password.",
  invalid_callback: "That sign-in link is invalid or expired. Try again.",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; message?: string }>;
}) {
  const query = await searchParams;
  return (
    <AuthShell
      eyebrow="Welcome back"
      title="Sign in to your workspace"
      description="Pick up where you left off and move the right work forward."
    >
      <LoginForm
        next={query.next}
        initialMessage={query.message ? messages[query.message] : undefined}
      />
    </AuthShell>
  );
}
