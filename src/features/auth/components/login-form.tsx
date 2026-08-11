"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { loginAction } from "@/features/auth/actions";
import {
  FieldError,
  FormStatus,
  inputClassName,
  SubmitButton,
} from "@/features/auth/components/form-controls";
import { loginSchema, type LoginInput } from "@/features/auth/schemas";

export function LoginForm({
  next,
  initialMessage,
}: {
  next?: string | undefined;
  initialMessage?: string | undefined;
}) {
  const router = useRouter();
  const [serverMessage, setServerMessage] = useState<string>();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "", next },
  });

  const onSubmit = handleSubmit(async (values) => {
    setServerMessage(undefined);
    const result = await loginAction(values);
    if (!result.ok) {
      setServerMessage(result.message);
      return;
    }
    router.push(result.redirectTo ?? "/dashboard");
    router.refresh();
  });

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      <FormStatus message={serverMessage ?? initialMessage} />
      <input type="hidden" {...register("next")} />
      <div>
        <label htmlFor="email" className="text-sm font-bold">
          Email address
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          inputMode="email"
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? "email-error" : undefined}
          className={inputClassName}
          placeholder="you@example.com"
          {...register("email")}
        />
        <FieldError id="email-error" message={errors.email?.message} />
      </div>
      <div>
        <div className="flex items-center justify-between gap-4">
          <label htmlFor="password" className="text-sm font-bold">
            Password
          </label>
          <Link
            href="/forgot-password"
            className="text-sm font-semibold text-violet-600 hover:underline dark:text-violet-300"
          >
            Forgot password?
          </Link>
        </div>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          aria-invalid={Boolean(errors.password)}
          aria-describedby={errors.password ? "password-error" : undefined}
          className={inputClassName}
          {...register("password")}
        />
        <FieldError id="password-error" message={errors.password?.message} />
      </div>
      <SubmitButton pending={isSubmitting}>
        {isSubmitting ? "Signing in…" : "Sign in"}
      </SubmitButton>
      <p className="text-muted-foreground text-center text-sm">
        New to TaskFlow?{" "}
        <Link
          href="/signup"
          className="font-bold text-violet-600 hover:underline dark:text-violet-300"
        >
          Create an account
        </Link>
      </p>
    </form>
  );
}
