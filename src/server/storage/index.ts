import "server-only";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { AwsClient } from "aws4fetch";
import { env, requireEnv } from "@/env";

/** Object storage for uploads. S3-compatible (Railway bucket) when configured, else local disk. */
export interface StorageProvider {
  readonly name: string;
  put(key: string, body: Uint8Array, contentType: string): Promise<void>;
  get(key: string): Promise<Uint8Array>;
}

class S3Storage implements StorageProvider {
  readonly name = "s3";
  private client = new AwsClient({
    accessKeyId: requireEnv("STORAGE_ACCESS_KEY_ID"),
    secretAccessKey: requireEnv("STORAGE_SECRET_ACCESS_KEY"),
    region: env.STORAGE_REGION,
    service: "s3",
  });

  private url(key: string) {
    const endpoint = new URL(requireEnv("STORAGE_ENDPOINT"));
    const bucket = requireEnv("STORAGE_BUCKET");
    const encoded = key.split("/").map(encodeURIComponent).join("/");
    return env.STORAGE_URL_STYLE === "virtual"
      ? `${endpoint.protocol}//${bucket}.${endpoint.host}/${encoded}`
      : `${endpoint.origin}/${bucket}/${encoded}`;
  }

  async put(key: string, body: Uint8Array, contentType: string) {
    // Sign first, then send the raw bytes: a streamed body would go out chunked, and the
    // bucket requires a Content-Length (411 otherwise).
    const signed = await this.client.sign(this.url(key), {
      method: "PUT",
      body: body as BodyInit,
      headers: { "Content-Type": contentType },
    });
    const res = await fetch(signed.url, {
      method: "PUT",
      headers: signed.headers,
      body: body as BodyInit,
    });
    if (!res.ok) throw new Error(`Storage PUT failed: ${res.status} ${await res.text()}`);
  }

  async get(key: string) {
    const res = await this.client.fetch(this.url(key));
    if (!res.ok) throw new Error(`Storage GET failed: ${res.status}`);
    return new Uint8Array(await res.arrayBuffer());
  }
}

/** Development and test fallback. Files go to .data/uploads (git-ignored). */
class LocalStorage implements StorageProvider {
  readonly name = "local";
  private root = path.join(process.cwd(), ".data", "uploads");

  private file(key: string) {
    const resolved = path.resolve(this.root, key);
    if (!resolved.startsWith(this.root + path.sep)) throw new Error("Invalid storage key");
    return resolved;
  }

  async put(key: string, body: Uint8Array) {
    const file = this.file(key);
    await mkdir(path.dirname(file), { recursive: true });
    await writeFile(file, body);
  }

  async get(key: string) {
    return new Uint8Array(await readFile(this.file(key)));
  }
}

let instance: StorageProvider | undefined;

export function storage(): StorageProvider {
  if (!instance) {
    if (env.STORAGE_BUCKET) instance = new S3Storage();
    // Staging and production must use the bucket; local disk is lost on every deploy.
    else if (env.APP_ENV === "development") instance = new LocalStorage();
    else throw new Error("Object storage is not configured (STORAGE_* variables).");
  }
  return instance;
}
