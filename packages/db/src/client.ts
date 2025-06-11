import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import * as schema from "./schema";

const connectionString =
  process.env["DATABASE_URL"] ??
  "postgresql://postgres:postgres@localhost:5432/acme";

const pool = new Pool({
  connectionString,
});

export const db = drizzle({ client: pool, schema, casing: "snake_case" });
