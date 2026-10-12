import { expect, test } from "@playwright/test";

test.describe("public site layout", () => {
  test("home page has one h1, the hero and the main sections", async ({ page }) => {
    await page.goto("/en");
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.getByRole("region", { name: "Featured services" })).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Tailored care for every kind of space" }),
    ).toBeVisible();
  });

  test("hero carousel is manual and keyboard operable", async ({ page }) => {
    await page.goto("/en");
    const tabs = page.getByRole("tab");
    await expect(tabs).toHaveCount(4);
    await expect(tabs.first()).toHaveAttribute("aria-selected", "true");
    await page.getByRole("button", { name: "Next slide" }).click();
    await expect(tabs.nth(1)).toHaveAttribute("aria-selected", "true");
    await tabs.nth(1).focus();
    await page.keyboard.press("ArrowRight");
    await expect(tabs.nth(2)).toHaveAttribute("aria-selected", "true");
    await expect(tabs.nth(2)).toBeFocused();
    // No autoplay: the selection is unchanged after waiting.
    await page.waitForTimeout(1500);
    await expect(tabs.nth(2)).toHaveAttribute("aria-selected", "true");
  });

  test("pages have unique titles and canonical + hreflang links", async ({ page }) => {
    const titles = new Set<string>();
    for (const path of ["/en", "/en/about", "/en/how-it-works"]) {
      await page.goto(path);
      titles.add(await page.title());
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
        "href",
        new RegExp(`${path}$`),
      );
      await expect(page.locator('link[rel="alternate"][hreflang="x-default"]')).toHaveCount(1);
    }
    expect(titles.size).toBe(3);
  });

  test("sticky quote button links to the contact page", async ({ page }) => {
    await page.goto("/en/about");
    const quote = page.getByRole("link", { name: "Request a quote" }).last();
    await expect(quote).toBeVisible();
    await expect(quote).toHaveAttribute("href", "/en/contact");
  });
});

test.describe("desktop navigation", () => {
  test.skip(({ isMobile }) => !!isMobile, "desktop only");

  test("mega-menu lists every service category", async ({ page }) => {
    await page.goto("/en");
    await page.getByRole("button", { name: "Services" }).click();
    const nav = page.getByRole("navigation", { name: "Main navigation" });
    for (const name of ["Residential", "Housekeeping", "Corporate & commercial"]) {
      await expect(nav.getByRole("link", { name, exact: true })).toBeVisible();
    }
    await expect(nav.getByRole("link", { name: "Office cleaning" })).toHaveAttribute(
      "href",
      "/en/services/office-cleaning",
    );
    await page.keyboard.press("Escape");
    await expect(nav.getByRole("link", { name: "Office cleaning" })).toBeHidden();
  });

  test("navigates to About from the header", async ({ page }) => {
    await page.goto("/en");
    await page
      .getByRole("navigation", { name: "Main navigation" })
      .getByRole("link", { name: "About" })
      .click();
    await expect(page).toHaveURL(/\/en\/about$/);
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Care you can rely on");
  });
});

test.describe("mobile navigation", () => {
  test.skip(({ isMobile }) => !isMobile, "mobile only");

  test("menu opens, traps focus and navigates", async ({ page }) => {
    await page.goto("/en");
    await page.getByRole("button", { name: "Open menu" }).click();
    const dialog = page.getByRole("dialog", { name: "Menu" });
    await expect(dialog).toBeVisible();
    await dialog.getByRole("link", { name: "How it works" }).click();
    await expect(page).toHaveURL(/\/en\/how-it-works$/);
    await expect(dialog).toBeHidden();
  });
});
