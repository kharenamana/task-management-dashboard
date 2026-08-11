import "server-only";

import { NextResponse } from "next/server";

import { getAuthenticatedUser } from "@/features/auth/session";

export type ApiAuthResult =
  { ok: true; userId: string } | { ok: false; response: NextResponse };

export async function requireApiUser(): Promise<ApiAuthResult> {
  const user = await getAuthenticatedUser();

  if (!user) {
    return {
      ok: false,
      response: NextResponse.json(
        {
          error: {
            code: "UNAUTHENTICATED",
            message: "Sign in to continue.",
          },
        },
        {
          status: 401,
          headers: { "Cache-Control": "private, no-store" },
        },
      ),
    };
  }

  return { ok: true, userId: user.id };
}
