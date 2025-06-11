import * as Sentry from "@sentry/nextjs";
import { NextResponse } from "next/server";

export function GET() {
  try {
    // Simulate an error
    throw new Error("API Route Test Error");
  } catch (error) {
    Sentry.captureException(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
