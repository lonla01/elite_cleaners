import "server-only";
import { createHash } from "node:crypto";
import { headers } from "next/headers";
import { env } from "@/env";

/**
 * The visitor's IP address, as seen by Railway's edge. `X-Real-IP` is set by the proxy; the
 * last `X-Forwarded-For` entry is the one the proxy appended (earlier entries are client-supplied).
 */
export async function clientIp() {
  const h = await headers();
  return (
    h.get("x-real-ip")?.trim() || h.get("x-forwarded-for")?.split(",").at(-1)?.trim() || "unknown"
  );
}

/** A salted hash, so that raw IP addresses are never stored. */
export function hashIdentifier(value: string) {
  return createHash("sha256")
    .update(`${env.AUTH_SECRET ?? "elite-cleaners"}:${value}`)
    .digest("hex")
    .slice(0, 32);
}
