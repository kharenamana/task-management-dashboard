import { LoaderCircle } from "lucide-react";

export const inputClassName =
  "border-border bg-background text-foreground placeholder:text-muted-foreground/70 mt-2 w-full rounded-xl border px-3.5 py-3 shadow-sm transition focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 disabled:cursor-not-allowed disabled:opacity-60";

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
