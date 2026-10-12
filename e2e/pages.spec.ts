import { expect, test } from "@playwright/test";

test.describe("cookie consent", () => {
  test("nothing optional loads before consent, and the choice is remembered", async ({ page }) => {
    const thirdParty: string[] = [];
    page.on("request", (r) => {
      if (!r.url().startsWith(new URL(page.url() || "http://localhost").origin)) {
        thirdParty.push(r.url());
      }
    });
    await page.goto("/en");
    const banner = page.getByRole("region", { name: "Your privacy" });
    await expect(banner).toBeVisible();
    expect(await page.context().cookies()).toHaveLength(0);
    expect(thirdParty.filter((u) => u.startsWith("http") && !u.includes("localhost"))).toEqual([]);

    await banner.getByRole("button", { name: "Decline" }).click();
    await expect(banner).toBeHidden();
    await page.reload();
    await expect(page.getByRole("region", { name: "Your privacy" })).toBeHidden();

    await page.getByRole("button", { name: "Cookie settings" }).click();
    await expect(page.getByRole("region", { name: "Your privacy" })).toContainText(
      "audience measurement declined",
    );
  });
});

test.describe("areas, testimonials, careers and legal pages", () => {
  test("areas page shows the canton map with OSM attribution and local pages", async ({ page }) => {
    await page.goto("/en/areas-we-serve");
    await expect(page.getByRole("group", { name: /Map of Luxembourg/ })).toBeVisible();
    await expect(page.getByRole("link", { name: "OpenStreetMap contributors" })).toBeVisible();
    await expect(page.getByText(/across the border.*on request/)).toBeVisible();
    await page
      .getByRole("main")
      .getByRole("link", { name: /Kirchberg/ })
      .first()
      .click();
    await expect(page).toHaveURL(/\/en\/areas-we-serve\/kirchberg$/);
    await expect(page.getByRole("heading", { level: 1, name: "Kirchberg" })).toBeVisible();
  });

  test("commune page links to local services and a prefilled quote", async ({ page }) => {
    await page.goto("/en/areas-we-serve/esch-sur-alzette");
    await expect(
      page.getByRole("heading", { name: "Popular services in Esch-sur-Alzette" }),
    ).toBeVisible();
    await expect(
      page.getByRole("main").getByRole("link", { name: "Request a quote" }),
    ).toHaveAttribute("href", "/en/contact?area=esch-sur-alzette");
  });

  for (const [path, heading] of [
    ["/en/testimonials", "In our clients' words"],
    ["/en/careers", "Join a team that takes pride in the details"],
    ["/en/privacy-policy", "Privacy policy"],
    ["/en/cookie-policy", "Cookie policy"],
    ["/en/legal-notice", "Legal notice"],
  ] as const) {
    test(`${path} renders`, async ({ page }) => {
      await page.goto(path);
      await expect(page.getByRole("heading", { level: 1, name: heading })).toBeVisible();
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
        "href",
        new RegExp(`${path}$`),
      );
    });
  }

  test("legal pages fill in company details from the settings", async ({ page }) => {
    await page.goto("/en/legal-notice");
    await expect(page.getByRole("main")).toContainText("RCS): B000000");
    await expect(page.getByRole("main")).not.toContainText("{rcs}");
  });
});
