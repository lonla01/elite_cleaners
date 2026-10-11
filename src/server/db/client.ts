import "server-only";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { requireEnv } from "@/env";
import * as schema from "./schema";

const globalForDb = globalThis as unknown as { sql?: ReturnType<typeof postgres> };

function createClient() {
  return postgres(requireEnv("DATABASE_URL"), { max: 10, prepare: false });
}

let instance: ReturnType<typeof drizzle<typeof schema>> | undefined;

/** Lazily connects, so that importing this module never requires DATABASE_URL at build time. */
export function db() {
  if (!instance) {
    // Reuse one connection pool across dev hot reloads.
    const sql = (globalForDb.sql ??= createClient());
    instance = drizzle(sql, { schema, casing: "snake_case" });
  }
  return instance;
}

export type Db = ReturnType<typeof db>;
