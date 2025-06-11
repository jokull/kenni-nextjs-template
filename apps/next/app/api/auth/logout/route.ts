import { NextResponse } from "next/server";

import { env } from "~/lib/env";
import { destroySession } from "~/lib/jwt-session";

export async function GET() {
  await destroySession();
  return NextResponse.redirect(
    new URL("/login", `https://${env.VERCEL_PROJECT_PRODUCTION_URL}`),
  );
}
