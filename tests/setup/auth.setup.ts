import { test, expect } from "@playwright/test";
import smtpTester from "smtp-tester";
import { load as cheerioLoad } from "cheerio";
import { authFile, testUserEmail } from "./constants";

test.describe("authenticate", () => {
  let mailServer: smtpTester.MailServer;

  test.beforeAll(async () => {
    mailServer = smtpTester.init(4025);
  });

  test.afterAll(() => {
    mailServer.stop(() => console.info("Shutting down test mail server"));
  });

  test("login", async ({ page }) => {
    await page.goto("/login");

    // your login page test logic
    await page.locator('input[name="email"]').fill(testUserEmail);
    await page.getByRole("button", { name: "login" }).click({ delay: 100 });

    await page.waitForSelector(`text=Check your email for a login link!`);

    let emailLink = null;

    try {
      const { email } = await mailServer.captureOne(testUserEmail, {
        wait: 1000,
      });

      const $ = cheerioLoad(email.html || "");

      // There's only one <a /> tag in the whole document. If you update the email body, this will likely need to be updated too
      emailLink = $("a").attr("href");
    } catch (cause) {
      console.error(
        `No message delivered to ${testUserEmail} in 1 second.`,
        cause
      );
    }

    expect(emailLink).toBeTruthy();

    const res = await page.goto(emailLink!);
    expect(res?.url()?.endsWith("/admin/overview")).toBeTruthy();

    await page.context().storageState({ path: authFile });
  });
});
