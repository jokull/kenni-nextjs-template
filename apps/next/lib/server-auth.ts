import * as Sentry from "@sentry/nextjs";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { cache } from "react";

import { db, User } from "@acme/db";
import { safeZodParse } from "@acme/utils";

import { getSession, sessionSchema } from "./jwt-session";

export interface ServerUser {
  userId: string;
  name: string;
  role: "user" | "admin";
}

function redirectToLogin(currentPath?: string): never {
  const loginUrl = currentPath
    ? `/login?next=${encodeURIComponent(currentPath)}`
    : "/login";
  redirect(loginUrl);
}

/**
 * Server-side function to get current user data
 * Cached to avoid multiple session reads per request
 */
export const getServerUser = cache(async (): Promise<ServerUser | null> => {
  const sessionResult = await getSession();

  if (sessionResult.isErr()) {
    return null;
  }

  const session = sessionResult.value;

  return {
    userId: session.userId,
    name: session.name,
    role: session.role,
  };
});

/**
 * Server-side function to require authentication with validation
 * Redirects to login if not authenticated or session invalid
 */
export async function requireServerAuth(
  currentPath?: string,
): Promise<ServerUser> {
  const sessionResult = await getSession();

  if (sessionResult.isErr()) {
    redirectToLogin(currentPath);
  }

  const session = sessionResult.value;

  // Re-validate session data with safeZodParse for extra safety
  const validationResult = safeZodParse(sessionSchema)(session);
  if (validationResult.isErr()) {
    validationResult.orTee((validationError) => {
      Sentry.captureException(new Error("Session validation failed"), {
        extra: { validationError, currentPath },
      });
    });
    redirectToLogin(currentPath);
  }
  const validatedSession = validationResult.value;

  // Set Sentry user context
  Sentry.setUser({
    id: validatedSession.userId,
    username: validatedSession.name,
  });

  return {
    userId: validatedSession.userId,
    name: validatedSession.name,
    role: validatedSession.role,
  };
}

/**
 * Server-side function to require authentication and return user from database
 * Redirects to login if not authenticated
 */
export async function requireServerUser(currentPath?: string): Promise<{
  session: ServerUser;
  user: User;
}> {
  const session = await requireServerAuth(currentPath);

  const [user] = await db
    .select()
    .from(User)
    .where(eq(User.id, session.userId))
    .limit(1);

  if (!user) {
    redirectToLogin(currentPath);
  }

  // Enhanced Sentry user context with email
  Sentry.setUser({
    id: session.userId,
    username: session.name,
    email: user.email || undefined,
  });

  return { session, user };
}

/**
 * Server-side function to require admin role
 * Redirects to login if not authenticated or not admin
 */
export async function requireServerAdmin(
  currentPath?: string,
): Promise<ServerUser> {
  const session = await requireServerAuth(currentPath);

  if (session.role !== "admin") {
    redirectToLogin(currentPath);
  }

  return session;
}

/**
 * Server-side function to require admin role and return user from database
 * Redirects to login if not authenticated or not admin
 */
export async function requireServerAdminUser(currentPath?: string): Promise<{
  session: ServerUser;
  user: User;
}> {
  const session = await requireServerAdmin(currentPath);

  const [user] = await db
    .select()
    .from(User)
    .where(eq(User.id, session.userId))
    .limit(1);

  if (!user) {
    redirectToLogin(currentPath);
  }

  // Enhanced Sentry user context for admin with email
  Sentry.setUser({
    id: session.userId,
    username: session.name,
    email: user.email || undefined,
  });

  return { session, user };
}
