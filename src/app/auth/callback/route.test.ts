import { NextRequest } from "next/server";

const { exchangeCodeForSession } = vi.hoisted(() => ({
  exchangeCodeForSession: vi.fn(),
}));

vi.mock("@/lib/supabase/server", () => ({
  createClient: async () => ({ auth: { exchangeCodeForSession } }),
}));

import { GET } from "@/app/auth/callback/route";

describe("authentication callback", () => {
  beforeEach(() => exchangeCodeForSession.mockReset());

  it("rejects callbacks without an authorization code", async () => {
    const response = await GET(
      new NextRequest("http://localhost:3000/auth/callback"),
    );

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe(
      "http://localhost:3000/login?message=invalid_callback",
    );
  });

  it("exchanges a valid code and redirects internally", async () => {
    exchangeCodeForSession.mockResolvedValue({ error: null });
    const response = await GET(
      new NextRequest(
        "http://localhost:3000/auth/callback?code=valid&next=%2Freset-password",
      ),
    );

    expect(exchangeCodeForSession).toHaveBeenCalledWith("valid");
    expect(response.headers.get("location")).toBe(
      "http://localhost:3000/reset-password",
    );
  });

  it("never follows an external next URL", async () => {
    exchangeCodeForSession.mockResolvedValue({ error: null });
    const response = await GET(
      new NextRequest(
        "http://localhost:3000/auth/callback?code=valid&next=https%3A%2F%2Fattacker.example",
      ),
    );

    expect(response.headers.get("location")).toBe(
      "http://localhost:3000/dashboard",
    );
  });
});
