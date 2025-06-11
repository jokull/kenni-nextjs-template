import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    DATABASE_URL: z.string().url(),
    SESSION_SECRET: z.string().min(32),
    KENNI_CLIENT_ID: z.string(),
    KENNI_CLIENT_SECRET: z.string(),
    KENNI_ISSUER_URL: z.string().url(),
    JWT_SECRET: z.string().min(32),
    POSTMARK_SERVER_API_TOKEN: z.string(),
    SENTRY_DSN: z.string().optional(),
    SENTRY_ORG: z.string().optional(),
    SENTRY_PROJECT: z.string().optional(),
    SENTRY_AUTH_TOKEN: z.string().optional(),
    VERCEL_PROJECT_PRODUCTION_URL: z.string(),
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
  },
  client: {
    NEXT_PUBLIC_SENTRY_DSN: z.string().optional(),
  },
  runtimeEnv: {
    DATABASE_URL: process.env["DATABASE_URL"],
    SESSION_SECRET: process.env["SESSION_SECRET"],
    KENNI_CLIENT_ID: process.env["KENNI_CLIENT_ID"],
    KENNI_CLIENT_SECRET: process.env["KENNI_CLIENT_SECRET"],
    KENNI_ISSUER_URL: process.env["KENNI_ISSUER_URL"],
    JWT_SECRET: process.env["JWT_SECRET"],
    POSTMARK_SERVER_API_TOKEN: process.env["POSTMARK_SERVER_API_TOKEN"],
    SENTRY_DSN: process.env["SENTRY_DSN"],
    SENTRY_ORG: process.env["SENTRY_ORG"],
    SENTRY_PROJECT: process.env["SENTRY_PROJECT"],
    SENTRY_AUTH_TOKEN: process.env["SENTRY_AUTH_TOKEN"],
    VERCEL_PROJECT_PRODUCTION_URL: process.env["VERCEL_PROJECT_PRODUCTION_URL"],
    NEXT_PUBLIC_SENTRY_DSN: process.env["NEXT_PUBLIC_SENTRY_DSN"],
    NODE_ENV: process.env["NODE_ENV"],
  },
});
