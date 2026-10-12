import { expect, test } from "@playwright/test";

test.describe("services", () => {
  test("overview lists every service under its category", async ({ page }) => {
    await page.goto("/en/services");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    for (const id of ["residential", "housekeeping", "corporate"]) {
      await expect(page.locator(`section#${id}`)).toBeVisible();
    }
    await expect(page.locator('main a[href^="/en/services/"]')).toHaveCount(15);
  });

  test("service page uses the shared template with FAQPage data", async ({ page }) => {
    await page.goto("/en/services/window-glass-cleaning");
    await expect(
      page.getByRole("heading", { level: 1, name: "Window & glass cleaning" }),
    ).toBeVisible();
    await expect(page.getByRole("heading", { name: "What's included" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Related services" })).toBeVisible();
    await expect(page.getByRole("navigation", { name: "Breadcrumb" })).toContainText("Services");

    const jsonLd = await page.locator('script[type="application/ld+json"]').allTextContents();
    const types = jsonLd.flatMap((text) => [JSON.parse(text)].flat().map((d) => d["@type"]));
    expect(types).toEqual(expect.arrayContaining(["Service", "FAQPage", "BreadcrumbList"]));

    await expect(
      page.getByRole("main").getByRole("link", { name: "Request a quote" }).first(),
    ).toHaveAttribute("href", "/en/contact?service=window-cleaning");
  });

  test("FAQ answers expand", async ({ page }) => {
    await page.goto("/en/services/office-cleaning");
    const question = page.getByText("Can you clean outside working hours?");
    await question.click();
    await expect(page.getByText(/Most of our office cleaning takes place/)).toBeVisible();
  });

  test("unknown service returns 404", async ({ page }) => {
    const response = await page.goto("/en/services/does-not-exist");
    expect(response?.status()).toBe(404);
  });
});
