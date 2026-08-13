import { z } from "zod";

const publicEnvironmentSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.url(),
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: z.string().min(1),
  NEXT_PUBLIC_SITE_URL: z.url(),
});

const parsedEnvironment = publicEnvironmentSchema.safeParse({
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY:
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  NEXT_PUBLIC_SITE_URL:
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
});

if (!parsedEnvironment.success) {
  const missingNames = parsedEnvironment.error.issues
    .map((issue) => issue.path.join("."))
    .join(", ");

  throw new Error(`Invalid public environment configuration: ${missingNames}`);
}

export const publicEnvironment = parsedEnvironment.data;

export const siteUrl = publicEnvironment.NEXT_PUBLIC_SITE_URL.replace(
  /\/$/,
  "",
);
