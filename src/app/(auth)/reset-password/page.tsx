import type { Metadata } from "next";

import { AuthShell } from "@/features/auth/components/auth-shell";
import { ResetPasswordForm } from "@/features/auth/components/reset-password-form";

export const metadata: Metadata = {
  title: "Choose a new password",
  robots: { index: false },
};

export default function ResetPasswordPage() {
  return (
    <AuthShell
      eyebrow="Secure recovery"
      title="Choose a new password"
      description="Use a strong password you do not use for another account."
    >
      <ResetPasswordForm />
    </AuthShell>
  );
}
