# Acme Template - pnpm Turbo Monorepo

## Project Structure

- `apps/next` - Next.js application with TypeScript, Tailwind, and Turbopack
- `packages/db` - Drizzle ORM database package with PostgreSQL

## Development Commands

```bash
# Install dependencies
pnpm install

# Start PostgreSQL database
pnpm db:up

# Run development server
pnpm dev

# Build all packages
pnpm build

# Run linting
pnpm lint

# Run type checking
pnpm type-check

# Database commands
pnpm db:down     # Stop database
pnpm db:logs     # View database logs
```

## Database Commands (from packages/db)

```bash
cd packages/db

# Generate migrations
pnpm db:generate

# Run migrations
pnpm db:migrate

# Push schema to database
pnpm db:push

# Open Drizzle Studio
pnpm db:studio
```

## Package Configuration

- **Package Manager**: pnpm with workspaces
- **Build Tool**: Turbo for task orchestration
- **Next.js App**: Uses `~/` path alias instead of `@/`
- **Database**: PostgreSQL with Drizzle ORM
- **Docker**: PostgreSQL container configured

## Database & Drizzle ORM

### Database Setup

- PostgreSQL 16 running in Docker container
- Default credentials: `postgres:postgres@localhost:5432/acme`
- Environment variables in `.env.example`

### Drizzle Schema Conventions

- **IDs**: Use `@paralleldrive/cuid2` for CUID IDs on all models
- **Timestamps**: Use `createdAt`, `modifiedAt` columns (no timezones - `timestamp` not `timestampz`)
- **Booleans**: Prefer nullable timestamps over boolean flags (e.g., `emailVerifiedAt` instead of `isEmailVerified`)
- **Enums**: Use text columns with Drizzle `.enum()` type enforcement over PostgreSQL enum types
- **Column Naming**: Use camelCase in TypeScript - Drizzle auto-converts to snake_case in database (no need to specify column names)
- For table types use PascalCase
- Use inferred select and export the same name type for the table

### Drizzle Best Practices

- Prefer additive changes; handle breaking changes with multi-step migrations
- Use drizzle-kit push for development, generate + migrate for production

## Setup Notes

- Turbopack enabled for Next.js development
- TypeScript configured across all packages
- ESLint and Tailwind CSS configured in Next.js app
- Workspace dependencies managed through pnpm workspaces
- Database package configured for direct imports (no build step)
- **Context7 MCP** configured for real-time documentation fetching

## Context7 MCP

- **Purpose**: Fetch up-to-date library documentation
- **Configured**: SSE transport to `https://mcp.context7.com/sse`
- **Usage**: Add "use context7" to prompts for automatic doc fetching
- **Tools**: `resolve-library-id`, `get-library-docs`

## Authentication Setup

- **Cookie-based authentication** with iron-session
- **Dokobit eID integration** for Baltic states authentication
- **T3 Environment validation** for type-safe env vars
- **Route protection** with Next.js middleware
- **React Context** for client-side auth state

## Getting Started

1. Copy `.env.example` to `.env` and fill in values
2. Run `pnpm install`
3. Start database: `pnpm db:up`
4. Push schema: `cd packages/db && pnpm db:push`
5. Start development: `pnpm dev`
6. Access protected routes after Dokobit authentication

## Developer Workflow

- At intervals, before wrapping up work, run format, lint fix and typecheck
- When constructing full URL's - use `https://${env.VERCEL_PROJECT_PRODUCTION_URL}` instead of localhost

## TypeScript Guidance

- Ask for guidance before resorting to "as any" in TypeScript - this is a last resort
- Use inferred return types instead of defining types
- **Never use `any`**: Use `unknown` instead and type guard appropriately

### Safe TypeScript Practices

- **Avoid `throw`**: Prefer explicit error handling with `Result<T, E>` patterns over throwing exceptions
- **Explicit Error Handling**: Make every potential failure mode explicit in the type system
- **Error Types**: Use discriminated unions for typed errors instead of generic Error objects
- **neverthrow Integration**: Consider using `neverthrow` library for functional error handling
- **Error Chaining**: Use `.andThen()`, `.map()`, `.orElse()` patterns for composable error handling
- **Type Safety**: Enable `noImplicitAny` and encourage upfront error consideration

### neverthrow Best Practices

- **Inferred Return Types**: Let neverthrow Result types be inferred, don't explicitly type `Promise<Result<T, E>>`
- **Preserve Error Logic**: Don't remove meaningful error handling (OAuth errors, domain validations) in the name of simplification
- **Let Errors Propagate**: Only transform errors when adding meaningful context, otherwise let them bubble up naturally
- **Avoid `any` in Chains**: Use `unknown` or proper types in `.andThen()` and `.map()` callbacks

## React Best Practices

- Avoid using useEffect when possible

## Drizzle Workflow Reminders

- Ask me to run drizzle kit migrations (`pnpm db:generate` specifically) since it's an interactive process

## Environment Variables

- When running scripts, if env is needed use dotenvx: i.e. `dotenvx run -f .env -- bun scripts/...`

## Infrastructure Notes

- Using Cloudflare tunnel with public URL: `acme.example.com`
