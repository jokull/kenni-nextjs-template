import { createId } from "@paralleldrive/cuid2";
import { date, index, pgTable, text, timestamp } from "drizzle-orm/pg-core";

// User roles enum
export const userRoleEnum = ["user", "admin"] as const;

export type UserRole = (typeof userRoleEnum)[number];

// Kennitala type enum
export const kennitalTypeEnum = ["person", "company"] as const;

export type KennitalType = (typeof kennitalTypeEnum)[number];

export const User = pgTable(
  "user",
  {
    id: text()
      .$defaultFn(() => createId())
      .primaryKey(),
    // Kenni authentication information
    personalCode: text().notNull().unique(), // National ID (kennitala) from Kenni
    fullName: text().notNull(), // Full name from Kenni
    // Kennitala derived information
    birthDate: date({ mode: "date" }).notNull(), // Birth date extracted from kennitala
    kennitalType: text({ enum: kennitalTypeEnum }).notNull(), // Person or company
    // Contact information
    email: text(), // Real email address for notifications (nullable until verified)
    // Email verification
    emailVerifiedAt: timestamp(), // Nullable timestamp instead of boolean
    // User role
    role: text({ enum: userRoleEnum }).notNull().default("user"),
    // Timestamps
    createdAt: timestamp().defaultNow().notNull(),
    modifiedAt: timestamp()
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    index().on(table.personalCode),
    index().on(table.email),
    index().on(table.role),
  ],
);

// Kenni login audit log
export const KenniLogin = pgTable(
  "kenni_login",
  {
    id: text()
      .$defaultFn(() => createId())
      .primaryKey(),
    userId: text()
      .notNull()
      .references(() => User.id, { onDelete: "cascade" }),
    // Kenni OIDC session information
    kennitalId: text().notNull(), // Kenni user ID
    idToken: text().notNull(), // OIDC ID token (encrypted)
    accessToken: text().notNull(), // OAuth2 access token (encrypted)
    // User claims at time of login
    userClaims: text().notNull(), // JSON string of OIDC claims
    // Login metadata
    ipAddress: text(),
    userAgent: text(),
    // Timestamps
    createdAt: timestamp().defaultNow().notNull(),
  },
  (table) => [
    index().on(table.userId),
    index().on(table.kennitalId),
    index().on(table.createdAt),
  ],
);

// Email log table
export const Email = pgTable(
  "email",
  {
    id: text()
      .$defaultFn(() => createId())
      .primaryKey(),
    // Email metadata
    to: text().notNull(),
    from: text().notNull(),
    subject: text().notNull(),
    // Email content
    textContent: text().notNull(),
    htmlContent: text().notNull(),
    // Status tracking
    status: text({ enum: ["sent", "failed", "development"] })
      .notNull()
      .default("development"),
    errorMessage: text(),
    // External service info
    postmarkMessageId: text(),
    // Timestamps
    createdAt: timestamp().defaultNow().notNull(),
  },
  (table) => [
    index().on(table.to),
    index().on(table.status),
    index().on(table.createdAt),
  ],
);

// Type exports following convention: PascalCase with inferred select types
export type User = typeof User.$inferSelect;
export type KenniLogin = typeof KenniLogin.$inferSelect;
export type Email = typeof Email.$inferSelect;
