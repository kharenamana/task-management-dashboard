import "server-only";

import { redirect } from "next/navigation";
import { cache } from "react";

import { userClaimsSchema } from "@/features/auth/schemas";
import { createClient } from "@/lib/supabase/server";

export type AuthenticatedUser = {
  id: string;
  email: string | null;
};

export async function getAuthenticatedContext() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error) return null;

  const claims = userClaimsSchema.safeParse(data?.claims);
  if (!claims.success) return null;

  return {
    client: supabase,
    user: {
      id: claims.data.sub,
      email: claims.data.email ?? null,
    } satisfies AuthenticatedUser,
  };
}

const getCachedPageContext = cache(getAuthenticatedContext);

export async function getAuthenticatedUser(): Promise<AuthenticatedUser | null> {
  return (await getAuthenticatedContext())?.user ?? null;
}

export async function requirePageContext(nextPath = "/dashboard") {
  const context = await getCachedPageContext();
  if (!context) redirect(`/login?next=${encodeURIComponent(nextPath)}`);
  return context;
}

export async function requirePageUser(nextPath = "/dashboard") {
  return (await requirePageContext(nextPath)).user;
}
