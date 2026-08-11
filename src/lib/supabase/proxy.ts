import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

import { resolveAuthRedirect } from "@/features/auth/routing";
import { publicEnvironment } from "@/lib/env";
import type { Database } from "@/types/database.generated";

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient<Database>(
    publicEnvironment.NEXT_PUBLIC_SUPABASE_URL,
    publicEnvironment.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet, cacheHeaders) {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value);
          });

          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
          Object.entries(cacheHeaders).forEach(([key, value]) => {
            response.headers.set(key, value);
          });
        },
      },
    },
  );

  const { data } = await supabase.auth.getClaims();
  const destination = resolveAuthRedirect({
    pathname: request.nextUrl.pathname,
    search: request.nextUrl.search,
    requestedNext: request.nextUrl.searchParams.get("next"),
    hasUser: Boolean(data?.claims?.sub),
  });

  if (!destination) {
    return response;
  }

  const redirectUrl = request.nextUrl.clone();
  const resolvedDestination = new URL(destination, request.url);
  redirectUrl.pathname = resolvedDestination.pathname;
  redirectUrl.search = resolvedDestination.search;
  redirectUrl.hash = resolvedDestination.hash;

  const redirectResponse = NextResponse.redirect(redirectUrl);
  response.cookies.getAll().forEach((cookie) => {
    redirectResponse.cookies.set(cookie);
  });

  for (const header of ["cache-control", "expires", "pragma"]) {
    const value = response.headers.get(header);
    if (value) redirectResponse.headers.set(header, value);
  }

  return redirectResponse;
}
