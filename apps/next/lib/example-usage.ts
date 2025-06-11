// Example usage of @acme/utils and other new dependencies

import { z } from "zod";

import {
  isNonEmptyArray,
  normalizeEmail,
  safeFetch,
  safeZodParse,
} from "@acme/utils";

// Example API response schema
const UserSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().email(),
  createdAt: z.string().datetime(),
});

type User = z.infer<typeof UserSchema>;

// Example: Safe API fetching with neverthrow
export async function fetchUser(id: number) {
  const result = await safeFetch<User>(`/api/users/${id}`);

  return result.match(
    (user) => ({
      success: true as const,
      data: user,
    }),
    (error) => {
      console.error("Failed to fetch user:", error);

      switch (error.type) {
        case "network":
          return { success: false as const, error: "Network error occurred" };
        case "http":
          return {
            success: false as const,
            error: `HTTP ${error.status}: ${error.url}`,
          };
        case "parse":
          return { success: false as const, error: "Invalid response format" };
      }
    },
  );
}

// Example: Safe Zod parsing
export function validateUserData(data: unknown) {
  const parseUser = safeZodParse(UserSchema);
  const result = parseUser(data);

  return result.match(
    (user) => ({
      success: true as const,
      data: user,
    }),
    (error) => ({
      success: false as const,
      error: error.error.issues.map((issue) => issue.message).join(", "),
    }),
  );
}

// Example: Email normalization
export function processEmailSignup(email: string) {
  const normalizedEmail = normalizeEmail(email);
  console.info(`Original: ${email}, Normalized: ${normalizedEmail}`);
  return normalizedEmail;
}

// Example: NonEmptyArray type guard
export function processUsers(users: User[]) {
  if (isNonEmptyArray(users)) {
    // TypeScript now knows users is [User, ...User[]]
    const firstUser = users[0]; // No undefined check needed
    console.info("First user:", firstUser.name);
    return users;
  }

  throw new Error("No users provided");
}
