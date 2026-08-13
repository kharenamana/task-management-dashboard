import type { Metadata } from "next";

import { AuthShell } from "@/features/auth/components/auth-shell";
import { SignupForm } from "@/features/auth/components/signup-form";

export const metadata: Metadata = {
  title: "Create an account",
  robots: { index: false },
};

export default function SignupPage() {
  return (
    <AuthShell
      eyebrow="Private beta"
      title="Create your TaskFlow"
      description="Start a private workspace and make progress visible in minutes."
    >
      <SignupForm />
    </AuthShell>
  );
}
