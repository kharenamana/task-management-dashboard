import "server-only";

import { NextResponse } from "next/server";

import { getAuthenticatedContext } from "@/features/auth/session";

export type ApiAuthResult =
  | {
      ok: true;
      userId: string;
      client: NonNullable<
        Awaited<ReturnType<typeof getAuthenticatedContext>>
      >["client"];
    }
  | { ok: false; response: NextResponse };

export async function requireApiUser(): Promise<ApiAuthResult> {
  const context = await getAuthenticatedContext();

  if (!context) {
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

  return {
    ok: true,
    userId: context.user.id,
    client: context.client,
  };
}
