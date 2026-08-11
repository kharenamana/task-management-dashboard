import type { NextRequest } from "next/server";

import { updateSession } from "@/lib/supabase/proxy";

export async function proxy(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/api/tasks/:path*",
    "/auth/callback",
    "/login",
    "/signup",
    "/reset-password",
  ],
};
