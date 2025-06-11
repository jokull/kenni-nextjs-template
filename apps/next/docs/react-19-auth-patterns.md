# React 19 Authentication Patterns Guide

This guide demonstrates how to implement modern authentication patterns using React 19's new features including the `use()` hook, `useActionState`, `useOptimistic`, and `useTransition`.

## Overview

Our authentication system leverages React 19's new capabilities to provide:

- **Conditional Context Consumption**: Use the `use()` hook inside conditionals and loops
- **Optimistic Updates**: Immediate UI feedback during auth operations
- **Server Actions Integration**: Seamless server-side auth handling
- **Enhanced Error Handling**: Better error boundaries and recovery
- **Type Safety**: Full TypeScript support throughout

## Key Components

### 1. AuthProvider (`/lib/auth-context.tsx`)

The main authentication provider using React 19 patterns:

```tsx
import { use, useActionState, useOptimistic, useTransition } from "react";

export function AuthProvider({ children, initialSession, initialUser }) {
  // Uses React 19's useActionState for handling async auth actions
  const [authState, submitAction, isPending] = useActionState(
    authAction,
    initialState,
  );

  // Uses useOptimistic for immediate UI feedback
  const [optimisticState, addOptimisticUpdate] = useOptimistic(
    authState,
    reducer,
  );

  // Uses useTransition for better loading states
  const [isPending, startTransition] = useTransition();

  return <AuthContext value={contextValue}>{children}</AuthContext>;
}
```

**Key Features:**

- **useActionState**: Manages auth actions (login, logout, refresh) with built-in pending states
- **useOptimistic**: Provides immediate UI feedback during auth operations
- **useTransition**: Handles loading states for better UX
- **Error Handling**: Robust error boundaries and recovery mechanisms

### 2. Auth Hooks

#### `useAuth()` - Standard Auth Hook

```tsx
export function useAuth(): AuthContextValue {
  const context = use(AuthContext); // Uses React 19's use() hook
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
```

#### `useAuthWhen()` - Conditional Auth Hook (React 19 Feature)

```tsx
export function useAuthWhen(condition: boolean): AuthContextValue | null {
  if (condition) {
    return use(AuthContext); // Can be called conditionally!
  }
  return null;
}
```

**React 19 Advantage**: The `use()` hook can be called inside conditionals, unlike traditional hooks.

### 3. Server-Side Integration (`/lib/server-auth.ts`)

Server Components integration with auth state:

```tsx
export async function createAuthProps() {
  const authState = await getServerAuthState();
  return {
    initialSession: authState.session,
    initialUser: authState.user,
    initialError: authState.error,
  };
}
```

**Pattern**: Server Components fetch auth state and pass it to Client Components for hydration.

## Usage Patterns

### Pattern 1: Basic Authentication

```tsx
// Server Component
export default async function MyPage() {
  const authProps = await createAuthProps();

  return (
    <AuthLayout {...authProps}>
      <MyContent />
    </AuthLayout>
  );
}

// Client Component
function MyContent() {
  const { session, user, logout } = useAuth();

  return (
    <div>
      <p>Welcome, {session?.name}</p>
      <button onClick={logout}>Sign Out</button>
    </div>
  );
}
```

### Pattern 2: Conditional Auth (React 19 Feature)

```tsx
function ConditionalAuthComponent({ showUserInfo }: { showUserInfo: boolean }) {
  // This is only possible in React 19!
  const auth = useAuthWhen(showUserInfo);

  if (!auth) return <div>Auth info hidden</div>;

  return <div>User: {auth.session?.name}</div>;
}
```

### Pattern 3: Optimistic Updates

```tsx
function AuthActions() {
  const { logout, isLoading } = useAuth();

  // The logout function uses useOptimistic internally
  // UI updates immediately, then syncs with server
  const handleLogout = () => {
    logout(); // Immediate UI update, then server call
  };

  return (
    <button onClick={handleLogout} disabled={isLoading}>
      {isLoading ? "Signing out..." : "Sign Out"}
    </button>
  );
}
```

### Pattern 4: Protected Routes

```tsx
// Declarative route protection
export default async function ProtectedPage() {
  const authProps = await createAuthProps();

  return (
    <AuthLayout
      {...authProps}
      requireAuth={true} // Requires authentication
      requireAdmin={false} // Doesn't require admin
    >
      <ProtectedContent />
    </AuthLayout>
  );
}
```

### Pattern 5: Higher-Order Components

```tsx
// HOC with auth requirements
const AdminComponent = withAuth(MyComponent, {
  requireAuth: true,
  requireAdmin: true,
});

// HOC that injects auth props
const AuthAwareComponent = withAuthProps(MyComponent);
```

## Server Actions Integration

### Auth-Protected Server Actions

```tsx
"use server";

import { getServerActionAuth } from "~/lib/server-auth";

export async function updateProfile(formData: FormData) {
  const authResult = await getServerActionAuth();

  if (authResult.isErr()) {
    return { error: "Unauthorized" };
  }

  const session = authResult.value;
  // Proceed with authenticated action
}
```

### Form Actions with Auth

```tsx
function ProfileForm() {
  const [state, action] = useActionState(updateProfileAction, initialState);

  return (
    <form action={action}>
      <input name="name" defaultValue={state.name} />
      <button type="submit">{state.pending ? "Updating..." : "Update"}</button>
    </form>
  );
}
```

## TypeScript Integration

### Comprehensive Type Safety

```tsx
import type { AuthContextValue, AuthenticatedProps } from "~/types/auth";

// Type-safe component with auth
function UserProfile({
  auth,
  className,
}: AuthenticatedProps<{ className?: string }>) {
  // auth is guaranteed to be available and properly typed
  return <div className={className}>Welcome, {auth.session.name}</div>;
}

// Conditional auth types
function ConditionalComponent({ showAuth }: { showAuth: boolean }) {
  const auth = useAuthWhen(showAuth);
  // TypeScript knows auth can be null
  if (auth?.session) {
    // TypeScript knows session is available here
    return <div>{auth.session.name}</div>;
  }
  return <div>No auth</div>;
}
```

## Error Handling

### React 19 Error Boundaries

```tsx
function AuthErrorBoundary({ error, onRetry }: AuthErrorBoundaryProps) {
  return (
    <div className="error-container">
      <h2>Authentication Error</h2>
      <p>{error}</p>
      <button onClick={onRetry}>Retry</button>
    </div>
  );
}

// Usage with automatic error recovery
function AuthLayout({ children }) {
  const { error, clearError, refreshAuth } = useAuth();

  if (error) {
    return (
      <AuthErrorBoundary
        error={error}
        onRetry={() => {
          clearError();
          refreshAuth();
        }}
      />
    );
  }

  return <>{children}</>;
}
```

## Performance Optimizations

### 1. Server-Side Hydration

```tsx
// Server Component provides initial state
export default async function Page() {
  const authProps = await createAuthPropsWithUser(); // Includes user data

  return (
    <AuthProvider {...authProps}>
      <PageContent />
    </AuthProvider>
  );
}
```

### 2. Selective Re-renders

```tsx
// Only re-renders when specific auth state changes
function UserAvatar() {
  const { user } = useAuth();
  // Component only re-renders when user changes, not on loading states

  return user ? <img src={user.avatar} /> : <DefaultAvatar />;
}
```

### 3. Optimistic UI Updates

```tsx
// Immediate UI feedback without waiting for server
function LogoutButton() {
  const { logout } = useAuth();

  return (
    <button onClick={logout}>Sign Out {/* UI updates immediately */}</button>
  );
}
```

## Migration from Traditional Patterns

### Before (Traditional useContext)

```tsx
// ❌ Old pattern - useContext must be at top level
function OldComponent({ condition }) {
  const auth = useContext(AuthContext); // Always called

  if (!condition) return null;

  return <div>{auth.user?.name}</div>;
}
```

### After (React 19 use() hook)

```tsx
// ✅ New pattern - conditional consumption
function NewComponent({ condition }) {
  if (!condition) return null;

  const auth = use(AuthContext); // Called conditionally!
  return <div>{auth.user?.name}</div>;
}
```

## Best Practices

1. **Server-First**: Fetch auth state on the server when possible
2. **Optimistic Updates**: Use `useOptimistic` for immediate feedback
3. **Error Boundaries**: Implement comprehensive error handling
4. **Type Safety**: Leverage TypeScript for better DX
5. **Conditional Hooks**: Use React 19's conditional `use()` hook appropriately
6. **Performance**: Minimize re-renders with targeted state updates

## Examples

See these files for complete examples:

- `/app/example-auth/page.tsx` - Comprehensive auth example
- `/app/dashboard/page.tsx` - Protected route with auth
- `/components/auth-layout.tsx` - Full auth layout implementation
- `/lib/auth-context.tsx` - Main auth provider
- `/lib/server-auth.ts` - Server-side auth utilities

## Testing

```tsx
// Test auth context with React 19 patterns
function TestComponent({ shouldShowAuth }) {
  const auth = useAuthWhen(shouldShowAuth);
  return auth ? <div>Authenticated</div> : <div>Not showing auth</div>;
}

// Test optimistic updates
test("logout shows immediate feedback", async () => {
  const { logout } = renderWithAuth(<LogoutButton />);

  logout();
  expect(screen.getByText("Signing out...")).toBeInTheDocument();
});
```

This implementation provides a modern, type-safe, and performant authentication system that takes full advantage of React 19's new capabilities while maintaining backward compatibility with existing patterns.
