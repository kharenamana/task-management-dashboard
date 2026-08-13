const sessionMocks = vi.hoisted(() => ({
  createClient: vi.fn(),
  getClaims: vi.fn(),
  redirect: vi.fn(),
}));

vi.mock("server-only", () => ({}));
vi.mock("next/navigation", () => ({ redirect: sessionMocks.redirect }));
vi.mock("@/lib/supabase/server", () => ({
  createClient: sessionMocks.createClient,
}));

import { getAuthenticatedUser, requirePageUser } from "@/features/auth/session";

describe("server session authorization", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    sessionMocks.createClient.mockResolvedValue({
      auth: { getClaims: sessionMocks.getClaims },
    });
  });

  it("returns only validated signed claim fields", async () => {
    sessionMocks.getClaims.mockResolvedValue({
      data: {
        claims: {
          sub: "6c56c766-b8aa-4c71-8183-80fdf1f0e169",
          email: "ada@example.com",
          untrusted: "ignored",
        },
      },
      error: null,
    });

    await expect(getAuthenticatedUser()).resolves.toEqual({
      id: "6c56c766-b8aa-4c71-8183-80fdf1f0e169",
      email: "ada@example.com",
    });
  });

  it("redirects missing users from the protected server boundary", async () => {
    sessionMocks.getClaims.mockResolvedValue({ data: null, error: null });
    sessionMocks.redirect.mockImplementation(() => {
      throw new Error("NEXT_REDIRECT");
    });

    await expect(requirePageUser("/dashboard?priority=high")).rejects.toThrow(
      "NEXT_REDIRECT",
    );
    expect(sessionMocks.redirect).toHaveBeenCalledWith(
      "/login?next=%2Fdashboard%3Fpriority%3Dhigh",
    );
  });
});
