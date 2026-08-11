import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const formMocks = vi.hoisted(() => ({
  signupAction: vi.fn(),
  forgotPasswordAction: vi.fn(),
  resetPasswordAction: vi.fn(),
  push: vi.fn(),
  refresh: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: formMocks.push, refresh: formMocks.refresh }),
}));
vi.mock("@/features/auth/actions", () => ({
  signupAction: formMocks.signupAction,
  forgotPasswordAction: formMocks.forgotPasswordAction,
  resetPasswordAction: formMocks.resetPasswordAction,
}));

import { ForgotPasswordForm } from "@/features/auth/components/forgot-password-form";
import { ResetPasswordForm } from "@/features/auth/components/reset-password-form";
import { SignupForm } from "@/features/auth/components/signup-form";

describe("authentication forms", () => {
  beforeEach(() => vi.clearAllMocks());

  it("shows the signup verification confirmation", async () => {
    formMocks.signupAction.mockResolvedValue({
      ok: true,
      message: "Check your email to verify your account, then sign in.",
    });
    const user = userEvent.setup();
    render(<SignupForm />);

    await user.type(screen.getByLabelText("Full name"), "Ada Lovelace");
    await user.type(screen.getByLabelText("Email address"), "ada@example.com");
    await user.type(screen.getByLabelText("Password"), "Secure123");
    await user.type(screen.getByLabelText("Confirm password"), "Secure123");
    await user.click(screen.getByRole("button", { name: "Create account" }));

    expect(await screen.findByRole("status")).toHaveTextContent(
      "Check your email",
    );
  });

  it("shows the generic forgot-password confirmation", async () => {
    formMocks.forgotPasswordAction.mockResolvedValue({
      ok: true,
      message:
        "If an account exists for that email, a password reset link is on its way.",
    });
    const user = userEvent.setup();
    render(<ForgotPasswordForm />);

    await user.type(screen.getByLabelText("Email address"), "ada@example.com");
    await user.click(screen.getByRole("button", { name: "Send reset link" }));

    expect(await screen.findByRole("status")).toHaveTextContent(
      "If an account exists",
    );
  });

  it("keeps the user on reset-password when the recovery session expired", async () => {
    formMocks.resetPasswordAction.mockResolvedValue({
      ok: false,
      message: "This reset session is invalid or expired. Request a new link.",
    });
    const user = userEvent.setup();
    render(<ResetPasswordForm />);

    await user.type(screen.getByLabelText("New password"), "NewSecure123");
    await user.type(
      screen.getByLabelText("Confirm new password"),
      "NewSecure123",
    );
    await user.click(screen.getByRole("button", { name: "Update password" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "invalid or expired",
    );
    expect(formMocks.push).not.toHaveBeenCalled();
  });
});
