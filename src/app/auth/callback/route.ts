import { NextResponse, type NextRequest } from "next/server";

import { safeRedirectPath } from "@/features/auth/routing";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const next = safeRedirectPath(request.nextUrl.searchParams.get("next"));

  if (!code) {
    return NextResponse.redirect(
      new URL("/login?message=invalid_callback", request.url),
    );
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(
      new URL("/login?message=invalid_callback", request.url),
    );
  }

  return NextResponse.redirect(new URL(next, request.url));
}
