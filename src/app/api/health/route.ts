import { connection } from "next/server";
import { sql } from "drizzle-orm";
import { env } from "@/env";
import { db } from "@/server/db/client";

// Railway health check. Reports database reachability without leaking details.
export async function GET() {
  await connection();
  let database: "ok" | "unconfigured" | "error" = "unconfigured";
  if (env.DATABASE_URL) {
    try {
      await db().execute(sql`select 1`);
      database = "ok";
    } catch {
      database = "error";
    }
  }
  const healthy = database !== "error";
  return Response.json(
    { status: healthy ? "ok" : "degraded", database },
    { status: healthy ? 200 : 503 },
  );
}
