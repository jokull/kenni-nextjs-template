import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env["SENTRY_DSN"],

  // Performance Monitoring
  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1,

  // Capture console logs
  integrations: [
    Sentry.captureConsoleIntegration({
      levels: ["error", "warn"],
    }),
  ],

  // Debug mode for development (disabled to reduce noise)
  debug: false,

  // Environment configuration
  environment: process.env.NODE_ENV,

  // Enable PII capture (be careful in production)
  sendDefaultPii: false,
});
