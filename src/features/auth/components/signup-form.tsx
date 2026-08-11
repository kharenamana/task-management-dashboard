"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { signupAction } from "@/features/auth/actions";
import {
  FieldError,
  FormStatus,
  inputClassName,
  SubmitButton,
} from "@/features/auth/components/form-controls";
import { signupSchema, type SignupInput } from "@/features/auth/schemas";

export function SignupForm() {
  const router = useRouter();
  const [result, setResult] = useState<{ message: string; success: boolean }>();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    setResult(undefined);
    const response = await signupAction(values);
    setResult({ message: response.message, success: response.ok });
    if (response.ok && response.redirectTo) {
      router.push(response.redirectTo);
      router.refresh();
    }
  });

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      <FormStatus message={result?.message} success={result?.success} />
      <div>
        <label htmlFor="fullName" className="text-sm font-bold">
          Full name
        </label>
        <input
          id="fullName"
          autoComplete="name"
          className={inputClassName}
          aria-invalid={Boolean(errors.fullName)}
          aria-describedby={errors.fullName ? "fullName-error" : undefined}
          {...register("fullName")}
        />
        <FieldError id="fullName-error" message={errors.fullName?.message} />
      </div>
      <div>
        <label htmlFor="email" className="text-sm font-bold">
          Email address
        </label>
        <input
          id="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="you@example.com"
          className={inputClassName}
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? "email-error" : undefined}
          {...register("email")}
        />
        <FieldError id="email-error" message={errors.email?.message} />
      </div>
      <div>
        <label htmlFor="password" className="text-sm font-bold">
          Password
        </label>
        <input
          id="password"
          type="password"
          autoComplete="new-password"
          className={inputClassName}
          aria-invalid={Boolean(errors.password)}
          aria-describedby={
            errors.password ? "password-error" : "password-hint"
          }
          {...register("password")}
        />
        <p id="password-hint" className="text-muted-foreground mt-1.5 text-xs">
          At least 8 characters with a letter and number.
        </p>
        <FieldError id="password-error" message={errors.password?.message} />
      </div>
      <div>
        <label htmlFor="confirmPassword" className="text-sm font-bold">
          Confirm password
        </label>
        <input
          id="confirmPassword"
          type="password"
          autoComplete="new-password"
          className={inputClassName}
          aria-invalid={Boolean(errors.confirmPassword)}
          aria-describedby={
            errors.confirmPassword ? "confirmPassword-error" : undefined
          }
          {...register("confirmPassword")}
        />
        <FieldError
          id="confirmPassword-error"
          message={errors.confirmPassword?.message}
        />
      </div>
      <SubmitButton pending={isSubmitting}>
        {isSubmitting ? "Creating account…" : "Create account"}
      </SubmitButton>
      <p className="text-muted-foreground text-center text-sm">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-bold text-violet-600 hover:underline dark:text-violet-300"
        >
          Sign in
        </Link>
      </p>
    </form>
  );
}
