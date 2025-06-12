import type { KnipConfig } from "knip";

const config: KnipConfig = {
  workspaces: {
    "apps/next": {
      // Add scripts as entry points on top of Next.js plugin detection
      entry: ["scripts/*.ts"],
    },
  },
  ignore: [
    // Build outputs and generated files
    "node_modules",
    "dist",
    "build",
    ".next",
    "coverage",
    ".turbo",
    // Template files - keep for developers to use
    "apps/next/lib/example-usage.ts",
    // Database migrations - keep all
    "packages/db/drizzle/**",
  ],
  ignoreDependencies: [
    // Template dependencies - keep for developers to use
    "postcss",
    "@internationalized/date",
    "remeda",
    "usehooks-ts",
  ],
  ignoreBinaries: [
    // External tools
    "cloudflared",
  ],
};

export default config;
