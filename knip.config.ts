import type { KnipConfig } from "knip";

const config: KnipConfig = {
  ignore: [
    // Build outputs and generated files
    "node_modules",
    "dist",
    "build",
    ".next",
    "coverage",
    ".turbo",
    // Scripts - utility scripts for development and deployment
    "apps/next/scripts/**",
    "packages/*/scripts/**",
    "**/scripts/**",
    // UI component library - keep all components for future use
    "apps/next/components/ui/**",
    // Example/demo files - keep for reference
    "apps/next/lib/example-usage.ts",
    // Email utilities - future feature
    "apps/next/lib/emails.ts",
    "apps/next/lib/user-emails.ts",
    "apps/next/emails/**",
    // Documentation - important patterns and guides
    "apps/next/docs/**",
    "**/*.md",
    // Database migrations - keep all
    "packages/db/drizzle/**",
    // Package build outputs
    "packages/*/dist/**",
    // Config and setup files
    "**/eslint.config.*",
    "**/tsconfig.json",
    "**/package.json",
    "**/next.config.*",
    "**/tailwind.config.*",
    "**/postcss.config.*",
    "**/drizzle.config.*",
    "**/prettier.config.*",
    "**/turbo.json",
    "**/pnpm-workspace.yaml",
    // Utility files that might not be directly imported
    "apps/next/utils/**",
    // Sentry config files
    "**/sentry.*.config.*",
    "**/instrumentation.ts",
  ],
};

export default config;
