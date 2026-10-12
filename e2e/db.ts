import { config } from "dotenv";
import postgres from "postgres";

// Same database as the server under test: CI sets DATABASE_URL, locally it is in .env.local.
config({ path: [".env.local", ".env"], quiet: true });

let sql: ReturnType<typeof postgres> | undefined;

export function testDb() {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is required for e2e tests");
  sql ??= postgres(process.env.DATABASE_URL, { max: 2 });
  return sql;
}

/** A unique, valid-looking address per test, so tests never collide. */
export function uniqueEmail(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}@example.com`;
}

/** Distinct client IP per test, so the rate limiter treats tests independently. */
export function randomIp() {
  const n = () => Math.floor(Math.random() * 250) + 1;
  return `10.${n()}.${n()}.${n()}`;
}
