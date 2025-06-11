import { withSentryConfig } from "@sentry/nextjs";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {},
};

export default withSentryConfig(nextConfig, {
  silent: true,
  debug: false,
  disableLogger: true,
  org: process.env["SENTRY_ORG"],
  project: process.env["SENTRY_PROJECT"],
  authToken: process.env["SENTRY_AUTH_TOKEN"],
});
