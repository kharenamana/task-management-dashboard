import "server-only";

import { redirect } from "next/navigation";

import { userClaimsSchema } from "@/features/auth/schemas";
import { createClient } from "@/lib/supabase/server";

export type AuthenticatedUser = {
  id: string;
  email: string | null;
};

export async function getAuthenticatedUser(): Promise<AuthenticatedUser | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error) return null;

  const claims = userClaimsSchema.safeParse(data?.claims);
  if (!claims.success) return null;

  return {
    id: claims.data.sub,
    email: claims.data.email ?? null,
  };
}

export async function requirePageUser(nextPath = "/dashboard") {
  const user = await getAuthenticatedUser();
  if (!user) redirect(`/login?next=${encodeURIComponent(nextPath)}`);
  return user;
}
