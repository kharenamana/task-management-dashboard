const fallbackPath = "/dashboard";

export function safeRedirectPath(
  candidate: string | null | undefined,
  fallback = fallbackPath,
) {
  if (
    !candidate ||
    !candidate.startsWith("/") ||
    candidate.startsWith("//") ||
    candidate.includes("\\") ||
    /[\r\n]/u.test(candidate)
  ) {
    return fallback;
  }

  try {
    const base = new URL("https://taskflow.local");
    const resolved = new URL(candidate, base);

    if (resolved.origin !== base.origin) {
      return fallback;
    }

    return `${resolved.pathname}${resolved.search}${resolved.hash}`;
  } catch {
    return fallback;
  }
}

export function isProtectedPage(pathname: string) {
  return (
    pathname === "/dashboard" ||
    pathname.startsWith("/dashboard/") ||
    pathname === "/reset-password"
  );
}

export function isGuestOnlyPage(pathname: string) {
  return pathname === "/login" || pathname === "/signup";
}

export function resolveAuthRedirect({
  pathname,
  search,
  requestedNext,
  hasUser,
}: {
  pathname: string;
  search: string;
  requestedNext: string | null;
  hasUser: boolean;
}) {
  if (!hasUser && isProtectedPage(pathname)) {
    return `/login?next=${encodeURIComponent(`${pathname}${search}`)}`;
  }

  if (hasUser && isGuestOnlyPage(pathname)) {
    return safeRedirectPath(requestedNext);
  }

  return null;
}
