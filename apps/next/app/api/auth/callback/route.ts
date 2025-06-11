import * as Sentry from "@sentry/nextjs";
import { eq } from "drizzle-orm";
import { ok, safeTry } from "neverthrow";
import { redirect } from "next/navigation";
import { NextResponse, type NextRequest } from "next/server";

import { db, KenniLogin, User } from "@acme/db";
import { exchangeCodeForTokens, parseIdTokenClaims } from "@acme/kenni";

import { env } from "~/lib/env";
import { createSession } from "~/lib/jwt-session";
import { parseKennitalaSafe } from "~/lib/kennitala";
import { toast } from "~/lib/toast-server";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const state = request.nextUrl.searchParams.get("state");

  if (!code || !state) {
    await toast("Ógild heimildarkall - vantar kóða eða stöðu");
    redirect("/login");
  }

  // Extract next URL and code verifier from state parameter
  const [, nextParam, codeVerifier] = state.split(":");
  const nextUrl = nextParam ? decodeURIComponent(nextParam) : "/";

  if (!codeVerifier) {
    await toast("Vantar öryggiskóða fyrir auðkenningu");
    redirect("/login");
  }

  // Process authentication with safeTry for clean error handling
  // oxlint-disable-next-line func-names
  const authResult = await safeTry(async function* () {
    // Create redirect URI for token exchange
    const redirectUri = `https://${env.VERCEL_PROJECT_PRODUCTION_URL}/api/auth/callback`;

    // Exchange authorization code for tokens
    const tokens = yield* await exchangeCodeForTokens({
      issuerUrl: env.KENNI_ISSUER_URL,
      clientId: env.KENNI_CLIENT_ID,
      clientSecret: env.KENNI_CLIENT_SECRET,
      code,
      redirectUri,
      codeVerifier,
    });

    // Parse and validate ID token claims
    const claims = yield* parseIdTokenClaims(tokens.id_token);

    const fullName = claims.name;
    const kennitala = claims.national_id;

    // Parse kennitala to extract type and birth date
    const kennitalData = yield* parseKennitalaSafe(kennitala);

    // Check if user exists by personal code (unique identifier from Kenni)
    const existingUsers = await db
      .select()
      .from(User)
      .where(eq(User.personalCode, kennitala))
      .limit(1);

    let user = existingUsers[0] ?? undefined;

    if (!user) {
      // Create new user
      const newUsers = await db
        .insert(User)
        .values({
          personalCode: kennitala,
          fullName: fullName,
          birthDate: kennitalData.birthDate,
          kennitalType: kennitalData.type,
        })
        .returning();
      user = newUsers[0]!;
    }

    // Log the Kenni login
    await db.insert(KenniLogin).values({
      userId: user.id,
      kennitalId: claims.sub,
      idToken: tokens.id_token, // Store encrypted in production
      accessToken: tokens.access_token, // Store encrypted in production
      userClaims: JSON.stringify(claims),
      ipAddress:
        request.headers.get("x-forwarded-for") ||
        request.headers.get("x-real-ip") ||
        "unknown",
      userAgent: request.headers.get("user-agent") || "unknown",
    });

    // Create session
    await createSession({
      userId: user.id,
      name: user.fullName,
      role: user.role,
    });

    return ok(nextUrl);
  }).orTee((error) => {
    Sentry.captureException(new Error("Authentication failed"), {
      extra: { error },
    });
  });

  // Handle authentication errors
  if (authResult.isErr()) {
    await toast("Innskráning mistókst. Vinsamlegast reynið aftur.");
    redirect("/login");
  }

  await toast("Þú ert innskráður með Kenni rafrænum skilríkjum");

  // Redirect to the next page or default
  return NextResponse.redirect(
    new URL(authResult.value, `https://${env.VERCEL_PROJECT_PRODUCTION_URL}`),
  );
}
