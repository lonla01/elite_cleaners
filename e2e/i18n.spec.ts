import { expect, test } from "@playwright/test";
import { randomIp, testDb, uniqueEmail } from "./db";

test.beforeEach(async ({ page }) => {
  await page.setExtraHTTPHeaders({ "x-real-ip": randomIp() });
  await page.addInitScript(() =>
    window.localStorage.setItem(
      "cookie-consent",
      JSON.stringify({ version: 1, analytics: false, decidedAt: new Date().toISOString() }),
    ),
  );
});

test.describe("French", () => {
  test("pages are in French with translated URLs", async ({ page }) => {
    await page.goto("/fr");
    await expect(page.locator("html")).toHaveAttribute("lang", "fr");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Votre intérieur");
    await page.goto("/fr/a-propos");
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "Un soin sur lequel compter",
    );
  });

  test("service pages pair English and French slugs in hreflang", async ({ page }) => {
    await page.goto("/fr/services/nettoyage-de-bureaux");
    await expect(
      page.getByRole("heading", { level: 1, name: "Nettoyage de bureaux" }),
    ).toBeVisible();
    await expect(page.locator('link[rel="alternate"][hreflang="en"]')).toHaveAttribute(
      "href",
      /\/en\/services\/office-cleaning$/,
    );
  });

  test("the language switcher keeps the current page", async ({ page, isMobile }) => {
    await page.goto("/en/areas-we-serve/luxembourg-city");
    if (isMobile) await page.getByRole("button", { name: "Open menu" }).click();
    const french = page.getByRole("link", { name: "Français" }).first();
    // The link itself must carry the translated path and slug (no redirect chain).
    await expect(french).toHaveAttribute("href", "/fr/zones-desservies/luxembourg-ville");
    await french.click();
    await expect(page).toHaveURL(/\/fr\/zones-desservies\/luxembourg-ville$/);
    await expect(page.getByRole("heading", { level: 1, name: "Luxembourg-Ville" })).toBeVisible();

    if (isMobile) await page.getByRole("button", { name: "Ouvrir le menu" }).click();
    await page.getByRole("link", { name: "English" }).first().click();
    await expect(page).toHaveURL(/\/en\/areas-we-serve\/luxembourg-city$/);
  });

  test("the contact form validates and confirms in French", async ({ page }) => {
    await page.goto("/fr/contact");
    await page.getByRole("button", { name: "Envoyer ma demande" }).click();
    await expect(page.getByRole("main").getByRole("alert")).toContainText(
      "Ce champ est obligatoire.",
    );

    const email = uniqueEmail("fr-lead");
    await page.getByLabel("Nom complet").fill("Visiteur Test");
    await page.getByLabel("Adresse e-mail").fill(email);
    await page.getByLabel("Votre message").fill("Ménage hebdomadaire pour un appartement.");
    await page.getByLabel(/J’ai lu la politique de confidentialité/).check();
    await page.getByRole("button", { name: "Envoyer ma demande" }).click();
    await expect(page.getByRole("main").getByRole("status")).toContainText("Merci");

    const sql = testDb();
    const [lead] = await sql`select id, locale from leads where email = ${email}`;
    expect(lead?.locale).toBe("fr");
    await expect
      .poll(async () => {
        const rows = await sql`select subject from email_log
          where related->>'leadId' = ${lead!.id} and template = 'lead-confirmation'`;
        return rows[0]?.subject;
      })
      .toMatch(/^Nous avons bien reçu votre demande/);
  });
});
