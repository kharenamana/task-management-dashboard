"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { forgotPasswordAction } from "@/features/auth/actions";
import {
  FieldError,
  FormStatus,
  inputClassName,
  SubmitButton,
} from "@/features/auth/components/form-controls";
import {
  forgotPasswordSchema,
  type ForgotPasswordInput,
} from "@/features/auth/schemas";

export function ForgotPasswordForm() {
  const [result, setResult] = useState<{ message: string; success: boolean }>();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = handleSubmit(async (values) => {
    const response = await forgotPasswordAction(values);
    setResult({ message: response.message, success: response.ok });
  });

  return (
    <form
      aria-label="Request password reset"
      onSubmit={onSubmit}
      noValidate
      className="space-y-5"
    >
      <FormStatus message={result?.message} success={result?.success} />
      <div>
        <label htmlFor="email" className="text-sm font-bold">
          Email address
        </label>
        <input
          id="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          className={inputClassName}
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? "email-error" : undefined}
          {...register("email")}
        />
        <FieldError id="email-error" message={errors.email?.message} />
      </div>
      <SubmitButton pending={isSubmitting}>
        {isSubmitting ? "Sending link…" : "Send reset link"}
      </SubmitButton>
      <p className="text-center text-sm">
        <Link href="/login" className="text-accent font-bold hover:underline">
          Return to sign in
        </Link>
      </p>
    </form>
  );
}
