import { eq } from "drizzle-orm";
import { NextResponse, type NextRequest } from "next/server";

import { db, Email } from "@acme/db";

import { env } from "~/lib/env";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
  // Only show in development
  if (env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const { id } = await params;

  // Get email from database
  const emails = await db.select().from(Email).where(eq(Email.id, id)).limit(1);

  const email = emails[0];

  if (!email) {
    return NextResponse.json({ error: "Email not found" }, { status: 404 });
  }

  // Return raw HTML content
  return new NextResponse(email.htmlContent, {
    headers: {
      "Content-Type": "text/html",
    },
  });
}
