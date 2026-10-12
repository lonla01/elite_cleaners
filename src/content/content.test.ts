import { readFile } from "node:fs/promises";
import { describe, expect, it, vi } from "vitest";
import type { z } from "zod";
import { allLocales } from "@/config/locales";
// Vite cannot resolve the nested dynamic JSON imports used by the file source, so tests read
// the same files from disk (with the same English fallback and validation).
vi.mock("./source/fs", () => ({
  async readContent(path: string, locale: string, schema: z.ZodType) {
    const read = (l: string) =>
      readFile(`content/${l}/${path}.json`, "utf8").then(JSON.parse, () => undefined);
    return schema.parse((await read(locale)) ?? (await read("en")));
  },
}));

import { getServicesPage, listServiceCategories, listServices } from "./index";

describe("content", () => {
  it.each(allLocales)("services are valid and consistent (%s)", async (locale) => {
    const [services, categories] = await Promise.all([
      listServices(locale),
      listServiceCategories(locale),
      getServicesPage(locale),
    ]);
    const ids = new Set(services.map((s) => s.id));
    expect(new Set(services.map((s) => s.slug)).size).toBe(services.length);
    for (const service of services) {
      expect(categories.map((c) => c.id)).toContain(service.category);
      for (const related of service.related) {
        expect(ids, `${service.id} → ${related}`).toContain(related);
        expect(related).not.toBe(service.id);
      }
    }
  });
});
