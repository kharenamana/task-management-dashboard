import { Eye, EyeOff, LoaderCircle } from "lucide-react";
import { forwardRef, useState } from "react";

export const inputClassName =
  "border-border bg-background text-foreground placeholder:text-muted-foreground/70 mt-2 w-full rounded-xl border px-3.5 py-3 shadow-sm transition focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 disabled:cursor-not-allowed disabled:opacity-60";

type PasswordInputProps = Omit<
  React.ComponentPropsWithoutRef<"input">,
  "type"
> & {
  visibilityLabel: string;
};

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  function PasswordInput(
    { className, disabled, visibilityLabel, ...inputProps },
    ref,
  ) {
    const [isVisible, setIsVisible] = useState(false);
    const actionLabel = isVisible ? "Hide" : "Show";

    return (
      <div className="relative">
        <input
          {...inputProps}
          ref={ref}
          type={isVisible ? "text" : "password"}
          disabled={disabled}
          className={`${inputClassName} pr-14 ${className ?? ""}`}
        />
        <button
          type="button"
          aria-label={`${actionLabel} ${visibilityLabel}`}
          aria-pressed={isVisible}
          disabled={disabled}
          onClick={() => setIsVisible((visible) => !visible)}
          className="text-muted-foreground hover:bg-muted hover:text-foreground absolute right-1.5 bottom-1.5 grid size-10 place-items-center rounded-lg transition disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isVisible ? (
            <EyeOff className="size-4.5" aria-hidden="true" />
          ) : (
            <Eye className="size-4.5" aria-hidden="true" />
          )}
        </button>
      </div>
    );
  },
);

export function FieldError({
  id,
  message,
}: {
  id: string;
  message?: string | undefined;
}) {
  if (!message) return null;
  return (
    <p id={id} className="text-danger mt-1.5 text-sm font-medium">
      {message}
    </p>
  );
}

export function FormStatus({
  message,
  success = false,
}: {
  message?: string | undefined;
  success?: boolean | undefined;
}) {
  if (!message) return null;
  return (
    <p
      role={success ? "status" : "alert"}
      className={`rounded-xl border px-3.5 py-3 text-sm font-semibold ${
        success
          ? "border-success/25 bg-success/10 text-success"
          : "border-danger/25 bg-danger/10 text-danger"
      }`}
    >
      {message}
    </p>
  );
}

export function SubmitButton({
  pending,
  children,
}: {
  pending: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="submit"
      disabled={pending}
      className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-500 px-4 py-3 font-bold text-white shadow-lg shadow-violet-500/20 transition hover:-translate-y-0.5 hover:shadow-xl disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-65"
    >
      {pending ? (
        <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
      ) : null}
      {children}
    </button>
  );
}
