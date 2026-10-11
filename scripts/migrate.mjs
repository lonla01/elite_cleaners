// Applies committed Drizzle migrations. Runs as Railway's pre-deploy command, and uses only
// production dependencies (drizzle-kit is a dev dependency).
import { existsSync } from "node:fs";
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";

const migrationsFolder = "./src/server/db/migrations";

if (!existsSync(`${migrationsFolder}/meta/_journal.json`)) {
  console.log("No migrations to apply.");
  process.exit(0);
}

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL is not set.");
  process.exit(1);
}

const sql = postgres(url, { max: 1 });
try {
  await migrate(drizzle(sql), { migrationsFolder });
  console.log("Migrations applied.");
} finally {
  await sql.end();
}
