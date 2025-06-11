import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env["NEXT_PUBLIC_SENTRY_DSN"],

  // Performance Monitoring
  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1,

  // Session Replay
  integrations: [
    Sentry.replayIntegration({
      maskAllText: true,
      blockAllMedia: true,
    }),
  ],
  replaysSessionSampleRate: 0.1, // 10% of sessions
  replaysOnErrorSampleRate: 1, // 100% of sessions with errors

  // Debug mode for development (disabled to reduce noise)
  debug: false,

  // Environment configuration
  environment: process.env.NODE_ENV,

  // Enable experimental features
  _experiments: {
    enableLogs: true,
  },
});
