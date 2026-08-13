import { resolveAuthRedirect, safeRedirectPath } from "@/features/auth/routing";

describe("authentication routing", () => {
  it.each([
    "https://attacker.example",
    "//attacker.example/path",
    "/\\attacker.example",
    "/dashboard\r\nLocation: https://attacker.example",
  ])("rejects unsafe redirect target %s", (target) => {
    expect(safeRedirectPath(target)).toBe("/dashboard");
  });

  it("preserves safe internal paths with query strings", () => {
    expect(safeRedirectPath("/dashboard?status=pending#tasks")).toBe(
      "/dashboard?status=pending#tasks",
    );
  });

  it("redirects unauthenticated protected requests to login", () => {
    expect(
      resolveAuthRedirect({
        pathname: "/dashboard",
        search: "?priority=high",
        requestedNext: null,
        hasUser: false,
      }),
    ).toBe("/login?next=%2Fdashboard%3Fpriority%3Dhigh");
  });

  it("redirects authenticated guests away from login", () => {
    expect(
      resolveAuthRedirect({
        pathname: "/login",
        search: "",
        requestedNext: "/dashboard?status=pending",
        hasUser: true,
      }),
    ).toBe("/dashboard?status=pending");
  });
});
