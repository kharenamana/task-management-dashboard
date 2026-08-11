"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { resetPasswordAction } from "@/features/auth/actions";
import {
  FieldError,
  FormStatus,
  inputClassName,
  SubmitButton,
} from "@/features/auth/components/form-controls";
import {
  resetPasswordSchema,
  type ResetPasswordInput,
} from "@/features/auth/schemas";

export function ResetPasswordForm() {
  const router = useRouter();
  const [message, setMessage] = useState<string>();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  const onSubmit = handleSubmit(async (values) => {
    setMessage(undefined);
    const response = await resetPasswordAction(values);
    if (!response.ok) {
      setMessage(response.message);
      return;
    }
    router.push(response.redirectTo ?? "/login");
    router.refresh();
  });

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      <FormStatus message={message} />
      <div>
        <label htmlFor="password" className="text-sm font-bold">
          New password
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
          Confirm new password
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
        {isSubmitting ? "Updating password…" : "Update password"}
      </SubmitButton>
      <p className="text-center text-sm">
        <Link
          href="/forgot-password"
          className="font-bold text-violet-600 hover:underline dark:text-violet-300"
        >
          Request a fresh link
        </Link>
      </p>
    </form>
  );
}
