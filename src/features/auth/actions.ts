"use server";

import { redirect } from "next/navigation";
import type { ZodError } from "zod";

import { toSafeAuthMessage } from "@/features/auth/errors";
import { safeRedirectPath } from "@/features/auth/routing";
import {
  forgotPasswordSchema,
  loginSchema,
  resetPasswordSchema,
  signupSchema,
} from "@/features/auth/schemas";
import type { AuthActionResult, AuthFieldErrors } from "@/features/auth/types";
import { siteUrl } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";

function validationFailure(error: ZodError): AuthActionResult {
  const fieldErrors: AuthFieldErrors = {};

  for (const issue of error.issues) {
    const field = issue.path[0];
    if (typeof field === "string" && !fieldErrors[field]) {
      fieldErrors[field] = issue.message;
    }
  }

  return {
    ok: false,
    message: "Check the highlighted fields and try again.",
    fieldErrors,
  };
}

export async function loginAction(input: unknown): Promise<AuthActionResult> {
  const parsed = loginSchema.safeParse(input);
  if (!parsed.success) return validationFailure(parsed.error);

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error) {
    return {
      ok: false,
      message: toSafeAuthMessage(
        error,
        "Unable to sign in. Try again shortly.",
      ),
    };
  }

  return {
    ok: true,
    message: "Welcome back.",
    redirectTo: safeRedirectPath(parsed.data.next),
  };
}

export async function signupAction(input: unknown): Promise<AuthActionResult> {
  const parsed = signupSchema.safeParse(input);
  if (!parsed.success) return validationFailure(parsed.error);

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: { full_name: parsed.data.fullName },
      emailRedirectTo: `${siteUrl}/auth/callback?next=/dashboard`,
    },
  });

  if (error) {
    return {
      ok: false,
      message: toSafeAuthMessage(
        error,
        "Unable to create your account. Try again shortly.",
      ),
    };
  }

  if (data.session) {
    return {
      ok: true,
      message: "Your account is ready.",
      redirectTo: "/dashboard",
    };
  }

  return {
    ok: true,
    message: "Check your email to verify your account, then sign in.",
  };
}

export async function forgotPasswordAction(
  input: unknown,
): Promise<AuthActionResult> {
  const parsed = forgotPasswordSchema.safeParse(input);
  if (!parsed.success) return validationFailure(parsed.error);

  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(
    parsed.data.email,
    { redirectTo: `${siteUrl}/auth/callback?next=/reset-password` },
  );

  if (error) {
    return {
      ok: false,
      message: "Unable to send a reset email. Try again shortly.",
    };
  }

  return {
    ok: true,
    message:
      "If an account exists for that email, a password reset link is on its way.",
  };
}

export async function resetPasswordAction(
  input: unknown,
): Promise<AuthActionResult> {
  const parsed = resetPasswordSchema.safeParse(input);
  if (!parsed.success) return validationFailure(parsed.error);

  const supabase = await createClient();
  const { data: claimsData, error: claimsError } =
    await supabase.auth.getClaims();

  if (claimsError || !claimsData?.claims?.sub) {
    return {
      ok: false,
      message: "This reset session is invalid or expired. Request a new link.",
    };
  }

  const { error } = await supabase.auth.updateUser({
    password: parsed.data.password,
  });

  if (error) {
    return {
      ok: false,
      message: toSafeAuthMessage(
        error,
        "Unable to update your password. Request a new reset link.",
      ),
    };
  }

  await supabase.auth.signOut({ scope: "local" });

  return {
    ok: true,
    message: "Password updated. Sign in with your new password.",
    redirectTo: "/login?message=password_updated",
  };
}

export async function logoutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut({ scope: "local" });
  redirect("/login?message=signed_out");
}
