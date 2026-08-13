import {
  forgotPasswordSchema,
  loginSchema,
  resetPasswordSchema,
  signupSchema,
} from "@/features/auth/schemas";

describe("authentication schemas", () => {
  it("normalizes email addresses during login", () => {
    const result = loginSchema.parse({
      email: "  Person@Example.COM ",
      password: "secret",
    });

    expect(result.email).toBe("person@example.com");
  });

  it("requires a strong matching password during signup", () => {
    const result = signupSchema.safeParse({
      fullName: "Ada Lovelace",
      email: "ada@example.com",
      password: "allletters",
      confirmPassword: "different1",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.password).toContain(
        "Include at least one number.",
      );
      expect(result.error.flatten().fieldErrors.confirmPassword).toContain(
        "Passwords do not match.",
      );
    }
  });

  it("validates recovery email and matching replacement passwords", () => {
    expect(
      forgotPasswordSchema.safeParse({ email: "not-an-email" }).success,
    ).toBe(false);
    expect(
      resetPasswordSchema.safeParse({
        password: "Secure123",
        confirmPassword: "Secure123",
      }).success,
    ).toBe(true);
  });
});
