# Kenni Next.js Template

A TypeScript monorepo template with Next.js 15, Drizzle ORM, and Kenni OIDC authentication. Includes complete kennitala integration for Icelandic applications.

## About Kenni Authentication

This template implements Kenni, an OIDC authentication service designed for Iceland:

- **Kennitala Integration**: Built-in validation and processing of Icelandic national IDs
- **OIDC/OAuth2 Compliant**: Standard authentication flow with PKCE security
- **User Management**: Complete user lifecycle with roles and audit logging
- **Type Safety**: Full TypeScript coverage with neverthrow error handling

Kenni provides a standardized way to authenticate Icelandic users using their kennitala, similar to how BankID works in other Nordic countries.

## 🚀 Features

- **Next.js 15** with App Router, Turbopack, and React 19
- **Kenni OIDC Authentication** with complete kennitala integration
- **PostgreSQL** with Drizzle ORM and type-safe database operations
- **JWT Sessions** using secure @oslojs cryptographic libraries
- **T3 Environment Variables** - Runtime validation with type safety
- **React Email Templates** - Beautiful, responsive email composition
- **Toast Notifications** - Elegant user feedback with Sonner
- **Tailwind Catalyst UI** - Production-ready component library
- **Kennitala Validation** - Robust validation using is-kennitala by Már Örlygsson
- **oxlint** - Ultra-fast Rust-based linting (replaces ESLint)
- **Comprehensive Error Handling** with neverthrow functional patterns
- **Turbo Monorepo** with intelligent build caching
- **Production Ready** - Vercel deployment optimized

## 📦 Monorepo Structure

```text
├── apps/
│   └── next/                 # Next.js app with Kenni authentication
├── packages/
│   ├── db/                   # Drizzle ORM with PostgreSQL schemas
│   ├── kenni/                # Kenni OIDC authentication package
│   └── utils/                # Shared utilities with neverthrow
```

## 🌐 Smart URL Management

This template uses a clever pattern for URL construction that works seamlessly in both development and production:

### The VERCEL_PROJECT_PRODUCTION_URL Pattern

Instead of hardcoding `localhost:3000` for development URLs, this template uses `VERCEL_PROJECT_PRODUCTION_URL` throughout the codebase for constructing absolute URLs in:

- **OAuth redirects** (Kenni authentication callbacks)
- **Email templates** (password reset, welcome emails)
- **API responses** (any absolute URLs returned to clients)

### Why This Matters for Development

When developing locally, you often need public URLs for testing:

- **Cloudflare Tunnels**: `cloudflared tunnel --url http://localhost:3000` → `https://abc123.trycloudflare.com`
- **LocalCan** (Mac): Exposes `localhost:3000` → `https://myapp.localcan.dev`

**The Problem**: If your app uses these tunnel URLs directly, you'll get:

- OAuth redirects to temporary tunnel URLs
- Email links pointing to `*.trycloudflare.com`
- Broken bookmarks when tunnels change

**The Solution**: Set `VERCEL_PROJECT_PRODUCTION_URL=https://yourdomain.com` in development. Now:

- OAuth redirects work correctly: `https://yourdomain.com/api/auth/callback`
- Email links are production-ready: `https://yourdomain.com/dashboard`
- Development closely mimics production URL behavior

This pattern eliminates the common problem of accidentally sending tunnel URLs in production emails or having OAuth flows break between environments.

## 🛠️ Development Commands

```bash
# Install dependencies
pnpm install

# Start PostgreSQL database
pnpm db:up

# Run development server (Next.js with Turbopack)
pnpm dev

# Linting and formatting
pnpm lint              # Run oxlint across all packages
pnpm lint:fix          # Auto-fix issues with oxlint
pnpm format            # Format code with Prettier
pnpm format:check      # Check code formatting

# Type checking and building
pnpm type-check        # TypeScript compilation check
pnpm build             # Build all packages for production

# Database operations
pnpm db:down           # Stop PostgreSQL container
pnpm db:logs           # View database logs
```

## 🔐 Kenni Authentication Flow

### Complete OIDC Implementation

```typescript
// Generate secure authorization URL with PKCE
const authUrl = await createKenniAuthorizationUrl({
  clientId: env.KENNI_CLIENT_ID,
  redirectUri: env.KENNI_REDIRECT_URI,
  scopes: ["openid", "profile"],
});

// Exchange authorization code for tokens
const result = await exchangeCodeForTokens({
  code: authCode,
  clientId: env.KENNI_CLIENT_ID,
  clientSecret: env.KENNI_CLIENT_SECRET,
  redirectUri: env.KENNI_REDIRECT_URI,
  codeVerifier: storedCodeVerifier,
});

// Parse and validate ID token claims
const claims = await parseIdTokenClaims(result.idToken);
// Claims include: kennitala, fullName, birthDate, and more
```

### Authentication Helpers

Four authentication helpers with automatic redirect handling:

```typescript
import {
  requiresAuth,
  requiresUser,
  requiresAdmin,
  requiresAdminUser,
} from "~/lib/auth";

// Basic session validation
const session = await requiresAuth("/dashboard");

// Session + user data from database
const { session, user } = await requiresUser("/profile");

// Admin role required
const session = await requiresAdmin("/admin");

// Admin role + full user data
const { session, user } = await requiresAdminUser("/admin/users");
```

### User Model with Kenni Integration

```typescript
// User schema with kennitala support
export const users = pgTable("user", {
  id: text("id").primaryKey().$defaultFn(() => createId()),
  personalCode: text("personal_code").unique().notNull(), // kennitala
  fullName: text("full_name").notNull(),
  birthDate: date("birth_date", { mode: "date" }),
  kennitalType: kennitalTypeEnum("kennital_type").default("person"),
  email: text("email"),
  emailVerifiedAt: timestamp("email_verified_at", { mode: "date" }),
  role: roleEnum("role").default("user").notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  modifiedAt: timestamp("modified_at", { mode: "date" }).defaultNow().notNull(),
});
```

## 🧰 Utility Packages & Features

### Email & Notifications

- **React Email Templates**: Responsive email templates using `@react-email/components`
- **Toast Notifications**: User feedback system with Sonner for elegant toast messages
- **Postmark Integration**: Production email delivery with comprehensive logging

### UI Components

- **Tailwind Catalyst**: Production-ready component library from Tailwind Labs
- **Headless UI**: Accessible, unstyled UI primitives for React
- **Framer Motion**: Smooth animations and micro-interactions

### Environment & Validation

- **T3 Environment Variables**: Runtime validation with separate client/server schemas
- **Kennitala Validation**: Robust Icelandic national ID validation using `is-kennitala` by Már Örlygsson
- **Zod Schemas**: Type-safe runtime validation throughout the application

## 🔧 Package Details

### @acme/kenni - Authentication Package

Complete OIDC implementation with kennitala support:

```typescript
import { createKenniAuthorizationUrl, exchangeCodeForTokens } from "@acme/kenni";

// Secure PKCE flow with state validation
// JWT verification with RS256 algorithm
// Comprehensive error handling with neverthrow
// Kennitala parsing and validation
```

### @acme/utils - Safe Utilities

Functional error handling with neverthrow:

```typescript
import { safeFetch, safeZodParse } from "@acme/utils";

// Safe HTTP requests with typed errors
const result = await safeFetch<User>("/api/users/1");
result.match(
  (user) => console.log("Success:", user),
  (error) => {
    switch (error.type) {
      case "network": // Network connectivity issues
      case "http": // HTTP error with status code
      case "parse": // JSON parsing failures
    }
  },
);

// Safe Zod parsing with error details
const parseResult = safeZodParse(UserSchema)(userData);
parseResult.match(
  (user) => console.log("Valid user:", user),
  (error) => console.log("Validation errors:", error.error.issues),
);
```

### @acme/db - Database Package

Type-safe database operations with Drizzle ORM:

- **Modern PostgreSQL** with full TypeScript inference
- **CUID2 identifiers** for collision resistance
- **Timestamp patterns** (createdAt, modifiedAt, emailVerifiedAt)
- **Enum support** with text columns instead of PostgreSQL enums
- **Comprehensive audit logging** for authentication events

## 🏗️ Quick Start

1. **Clone and install**:

   ```bash
   git clone <your-repo-url>
   cd kenni-nextjs-template
   pnpm install
   ```

2. **Environment setup**:

   ```bash
   cd apps/next
   cp .env.example .env
   # Configure your Kenni OIDC credentials and database
   cd ../..
   ```

3. **Database setup**:

   ```bash
   pnpm db:up
   cd packages/db && pnpm db:push
   ```

4. **Start development**:

   ```bash
   pnpm dev
   # Visit http://localhost:3000
   ```

## 🔧 Technology Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS 4
- **Backend**: Next.js API routes, Drizzle ORM, PostgreSQL 16
- **Authentication**: Kenni OIDC, JWT with @oslojs/jwt
- **Development**: oxlint, Prettier, Turbo, TypeScript 5
- **Deployment**: Vercel-optimized with production environment support

## 📄 License

MIT License - Free to use for building applications with Kenni authentication.

## 🤝 Contributing

This template helps Icelandic developers build applications with proper eID integration. Contributions welcome.
