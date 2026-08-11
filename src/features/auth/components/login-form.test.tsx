import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const { push, refresh, loginAction } = vi.hoisted(() => ({
  push: vi.fn(),
  refresh: vi.fn(),
  loginAction: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push, refresh }),
}));

vi.mock("@/features/auth/actions", () => ({ loginAction }));

import { LoginForm } from "@/features/auth/components/login-form";

describe("LoginForm", () => {
  beforeEach(() => {
    push.mockReset();
    refresh.mockReset();
    loginAction.mockReset();
  });

  it("shows accessible client validation errors", async () => {
    const user = userEvent.setup();
    render(<LoginForm />);

    expect(screen.getByRole("form", { name: "Sign in" })).toBeVisible();

    await user.click(screen.getByRole("button", { name: "Sign in" }));

    expect(
      await screen.findByText("Enter a valid email address."),
    ).toBeVisible();
    expect(screen.getByText("Enter your password.")).toBeVisible();
    expect(screen.getByLabelText("Email address")).toHaveAttribute(
      "aria-invalid",
      "true",
    );
    expect(loginAction).not.toHaveBeenCalled();
  });

  it("renders a sanitized server error without navigating", async () => {
    loginAction.mockResolvedValue({
      ok: false,
      message: "The email or password is incorrect.",
    });
    const user = userEvent.setup();
    render(<LoginForm next="/dashboard?status=pending" />);

    await user.type(screen.getByLabelText("Email address"), "ada@example.com");
    await user.type(screen.getByLabelText("Password"), "wrong-password");
    await user.click(screen.getByRole("button", { name: "Sign in" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "The email or password is incorrect.",
    );
    expect(push).not.toHaveBeenCalled();
  });

  it("navigates to the validated destination after login", async () => {
    loginAction.mockResolvedValue({
      ok: true,
      message: "Welcome back.",
      redirectTo: "/dashboard?status=pending",
    });
    const user = userEvent.setup();
    render(<LoginForm next="/dashboard?status=pending" />);

    await user.type(screen.getByLabelText("Email address"), "ada@example.com");
    await user.type(screen.getByLabelText("Password"), "Secure123");
    await user.click(screen.getByRole("button", { name: "Sign in" }));

    expect(loginAction).toHaveBeenCalledWith({
      email: "ada@example.com",
      password: "Secure123",
      next: "/dashboard?status=pending",
    });
    expect(push).toHaveBeenCalledWith("/dashboard?status=pending");
    expect(refresh).toHaveBeenCalled();
  });
});
