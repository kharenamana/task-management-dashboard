import type { AuthError } from "@supabase/supabase-js";

const knownMessages: Record<string, string> = {
  "invalid login credentials": "The email or password is incorrect.",
  "email not confirmed": "Confirm your email before signing in.",
  "user already registered": "An account with this email already exists.",
  "new password should be different from the old password":
    "Choose a password you have not used for this account.",
};

export function toSafeAuthMessage(
  error: Pick<AuthError, "message"> | null,
  fallback: string,
) {
  if (!error) return fallback;
  return knownMessages[error.message.toLowerCase()] ?? fallback;
}
