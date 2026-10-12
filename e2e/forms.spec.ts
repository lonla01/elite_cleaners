import { expect, test, type Page } from "@playwright/test";
import { randomIp, testDb, uniqueEmail } from "./db";

test.beforeEach(async ({ page }) => {
  await page.setExtraHTTPHeaders({ "x-real-ip": randomIp() });
  // Decide on cookies up front so the banner never covers the form.
  await page.addInitScript(() =>
    window.localStorage.setItem(
      "cookie-consent",
      JSON.stringify({ version: 1, analytics: false, decidedAt: new Date().toISOString() }),
    ),
  );
});

async function fillContact(page: Page, email: string) {
  await page.getByLabel("Full name").fill("Test Visitor");
  await page.getByLabel("Email address").fill(email);
  await page.getByLabel("Phone number").fill("+352 621 000 000");
  await page.getByLabel("Your message").fill("Weekly cleaning for a three-bedroom apartment.");
  await page.getByLabel(/I have read the privacy policy/).check();
}

test.describe("contact form", () => {
  test("shows accessible errors when required fields are missing", async ({ page }) => {
    await page.goto("/en/contact");
    await page.getByRole("button", { name: "Send my request" }).click();
    const summary = page.getByRole("main").getByRole("alert");
    await expect(summary).toBeFocused();
    await expect(summary).toContainText("Full name: This field is required.");
    await expect(summary).toContainText("Please accept the privacy policy");
    await expect(page.getByLabel("Full name")).toHaveAttribute("aria-invalid", "true");
  });

  test("keeps entered values after a validation error", async ({ page }) => {
    await page.goto("/en/contact");
    await page.getByLabel("Full name").fill("Kept Name");
    await page.getByLabel("Email address").fill("not-an-email");
    await page.getByRole("button", { name: "Send my request" }).click();
    await expect(page.getByRole("main").getByRole("alert")).toContainText(
      "Enter a valid email address",
    );
    await expect(page.getByLabel("Full name")).toHaveValue("Kept Name");
  });

  test("stores the lead and sends both emails", async ({ page }) => {
    const email = uniqueEmail("lead");
    await page.goto("/en/contact?service=office-cleaning&area=strassen");
    await expect(page.getByRole("combobox", { name: /^Service/ })).toHaveValue("office-cleaning");
    await expect(page.getByLabel("Commune or postcode")).toHaveValue("Strassen");
    await fillContact(page, email);
    await page.getByRole("button", { name: "Send my request" }).click();
    await expect(page.getByRole("main").getByRole("status")).toContainText(
      "your request is on its way",
    );

    const sql = testDb();
    const [lead] = await sql`select * from leads where email = ${email}`;
    expect(lead).toMatchObject({
      name: "Test Visitor",
      service_id: "office-cleaning",
      location: "Strassen",
      locale: "en",
      status: "new",
    });
    expect(lead!.consent_version).toBeTruthy();

    // Emails are sent after the response.
    await expect
      .poll(async () => {
        const rows = await sql`select template, status from email_log
          where related->>'leadId' = ${lead!.id} order by template`;
        return rows.map((r) => `${r.template}:${r.status}`);
      })
      .toEqual(["lead-confirmation:sent", "lead-notification:sent"]);
  });

  test("silently discards submissions that fill the honeypot", async ({ page }) => {
    const email = uniqueEmail("bot");
    await page.goto("/en/contact");
    await fillContact(page, email);
    await page.locator('input[name="website"]').evaluate((el: HTMLInputElement) => {
      el.value = "https://spam.example";
    });
    await page.getByRole("button", { name: "Send my request" }).click();
    await expect(page.getByRole("main").getByRole("status")).toContainText(
      "your request is on its way",
    );
    const rows = await testDb()`select id from leads where email = ${email}`;
    expect(rows).toHaveLength(0);
  });

  test("rate-limits repeated submissions", async ({ page, isMobile }) => {
    test.skip(!!isMobile, "server behaviour, tested once");
    for (let i = 0; i < 6; i++) {
      await page.goto("/en/contact");
      await fillContact(page, uniqueEmail("limit"));
      await page.getByRole("button", { name: "Send my request" }).click();
      if (i < 5) await expect(page.getByRole("main").getByRole("status")).toBeVisible();
    }
    await expect(page.getByRole("main").getByRole("alert")).toContainText("Too many attempts");
  });
});

test.describe("careers form", () => {
  async function fillApplication(page: Page, email: string) {
    await page.getByLabel("Full name").fill("Test Candidate");
    await page.getByLabel("Email address").fill(email);
    await page.getByLabel("Phone number").fill("+352 621 111 111");
    await page.getByLabel("French").check();
    await page.getByLabel("Portuguese").check();
    await page.getByLabel("Availability").selectOption("part-time");
    await page.getByLabel(/I have read the privacy policy/).check();
  }

  test("stores the application with its CV", async ({ page }) => {
    const email = uniqueEmail("applicant");
    await page.goto("/en/careers");
    await fillApplication(page, email);
    await page.getByLabel("CV").setInputFiles({
      name: "cv.pdf",
      mimeType: "application/pdf",
      buffer: Buffer.from("%PDF-1.4\n% test CV\n"),
    });
    await page.getByRole("button", { name: "Send my application" }).click();
    await expect(page.getByRole("main").getByRole("status")).toContainText(
      "Thank you for your application",
    );

    const [row] = await testDb()`select a.languages, a.availability, f.filename, f.content_type
      from job_applications a left join files f on f.id = a.cv_file_id where a.email = ${email}`;
    expect(row).toMatchObject({
      languages: ["fr", "pt"],
      availability: "part-time",
      filename: "cv.pdf",
      content_type: "application/pdf",
    });
  });

  test("rejects files that are not PDF or Word documents", async ({ page }) => {
    await page.goto("/en/careers");
    await fillApplication(page, uniqueEmail("badfile"));
    await page.getByLabel("CV").setInputFiles({
      name: "cv.pdf",
      mimeType: "application/pdf",
      buffer: Buffer.from("MZ not really a pdf"),
    });
    await page.getByRole("button", { name: "Send my application" }).click();
    await expect(page.getByRole("main").getByRole("alert")).toContainText(
      "Upload a PDF or Word document.",
    );
  });
});
