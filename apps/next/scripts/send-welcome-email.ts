#!/usr/bin/env bun

/**
 * Script to send a welcome email
 * Usage: dotenvx run -f .env -- bun scripts/send-welcome-email.ts [userId]
 * If no userId provided, selects a random user
 */
import { eq } from "drizzle-orm";

import { db, User } from "@acme/db";

import { sendWelcomeEmail } from "~/lib/emails";

async function main() {
  const userId = process.argv[2];

  let user = null;

  if (userId) {
    // Use provided user ID
    const users = await db
      .select()
      .from(User)
      .where(eq(User.id, userId))
      .limit(1);

    user = users[0];

    if (!user) {
      console.error(`❌ User with ID ${userId} not found`);
      process.exit(1);
    }
  } else {
    // Select a random user
    const users = await db.select().from(User).limit(1);

    user = users[0];

    if (!user) {
      console.error("❌ No users found in database");
      process.exit(1);
    }
  }

  console.info(`📧 Sending welcome email to: ${user.fullName}`);

  // Send welcome email with placeholder email
  const result = await sendWelcomeEmail({
    email: "demo@example.com",
    name: user.fullName,
  });

  if (result?.isErr()) {
    console.error("❌ Failed to send email:", result.error);
    process.exit(1);
  }

  console.info("✅ Email sent successfully!");
}

main().catch((error) => {
  console.error("❌ Script failed:", error);
  process.exit(1);
});
