const mocks = vi.hoisted(() => ({
  createClient: vi.fn(),
  redirect: vi.fn(),
  signInWithPassword: vi.fn(),
  signUp: vi.fn(),
  resetPasswordForEmail: vi.fn(),
  getClaims: vi.fn(),
  updateUser: vi.fn(),
  signOut: vi.fn(),
}));

vi.mock("next/navigation", () => ({ redirect: mocks.redirect }));
vi.mock("@/lib/supabase/server", () => ({
  createClient: mocks.createClient,
}));

import {
  forgotPasswordAction,
  loginAction,
  logoutAction,
  resetPasswordAction,
  signupAction,
} from "@/features/auth/actions";

describe("authentication server actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.createClient.mockResolvedValue({
      auth: {
        signInWithPassword: mocks.signInWithPassword,
        signUp: mocks.signUp,
        resetPasswordForEmail: mocks.resetPasswordForEmail,
        getClaims: mocks.getClaims,
        updateUser: mocks.updateUser,
        signOut: mocks.signOut,
      },
    });
  });

  it("does not call Supabase when login input is invalid", async () => {
    const result = await loginAction({ email: "bad", password: "" });

    expect(result.ok).toBe(false);
    expect(mocks.createClient).not.toHaveBeenCalled();
  });

  it("sanitizes provider errors and rejects external login redirects", async () => {
    mocks.signInWithPassword.mockResolvedValue({
      error: { message: "Invalid login credentials" },
    });
    const failed = await loginAction({
      email: "ada@example.com",
      password: "wrong",
    });
    expect(failed).toEqual({
      ok: false,
      message: "The email or password is incorrect.",
    });

    mocks.signInWithPassword.mockResolvedValue({ error: null });
    const succeeded = await loginAction({
      email: "ada@example.com",
      password: "Secure123",
      next: "https://attacker.example",
    });
    expect(succeeded).toMatchObject({ ok: true, redirectTo: "/dashboard" });
  });

  it("creates a signup with bounded profile metadata and callback URL", async () => {
    mocks.signUp.mockResolvedValue({ data: { session: null }, error: null });

    const result = await signupAction({
      fullName: "Ada Lovelace",
      email: "ADA@example.com",
      password: "Secure123",
      confirmPassword: "Secure123",
    });

    expect(mocks.signUp).toHaveBeenCalledWith({
      email: "ada@example.com",
      password: "Secure123",
      options: {
        data: { full_name: "Ada Lovelace" },
        emailRedirectTo: "http://localhost:3000/auth/callback?next=/dashboard",
      },
    });
    expect(result).toMatchObject({ ok: true });
  });

  it("uses a non-enumerating recovery success message", async () => {
    mocks.resetPasswordForEmail.mockResolvedValue({ error: null });

    const result = await forgotPasswordAction({ email: "ada@example.com" });

    expect(result).toEqual({
      ok: true,
      message:
        "If an account exists for that email, a password reset link is on its way.",
    });
  });

  it("requires recovery claims before updating the password", async () => {
    mocks.getClaims.mockResolvedValue({
      data: { claims: null },
      error: { message: "expired" },
    });

    const result = await resetPasswordAction({
      password: "NewSecure123",
      confirmPassword: "NewSecure123",
    });

    expect(result).toMatchObject({ ok: false });
    expect(mocks.updateUser).not.toHaveBeenCalled();
  });

  it("updates a recovered password and clears the local session", async () => {
    mocks.getClaims.mockResolvedValue({
      data: { claims: { sub: "6c56c766-b8aa-4c71-8183-80fdf1f0e169" } },
      error: null,
    });
    mocks.updateUser.mockResolvedValue({ error: null });
    mocks.signOut.mockResolvedValue({ error: null });

    const result = await resetPasswordAction({
      password: "NewSecure123",
      confirmPassword: "NewSecure123",
    });

    expect(mocks.updateUser).toHaveBeenCalledWith({
      password: "NewSecure123",
    });
    expect(mocks.signOut).toHaveBeenCalledWith({ scope: "local" });
    expect(result).toMatchObject({
      ok: true,
      redirectTo: "/login?message=password_updated",
    });
  });

  it("signs out locally before redirecting", async () => {
    mocks.signOut.mockResolvedValue({ error: null });
    mocks.redirect.mockImplementation(() => {
      throw new Error("NEXT_REDIRECT");
    });

    await expect(logoutAction()).rejects.toThrow("NEXT_REDIRECT");
    expect(mocks.signOut).toHaveBeenCalledWith({ scope: "local" });
    expect(mocks.redirect).toHaveBeenCalledWith("/login?message=signed_out");
  });
});
