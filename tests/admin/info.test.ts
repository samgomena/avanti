import { test, expect } from "@playwright/test";

test("/admin/info redirects", async ({ page }) => {
  const res = await page.goto("/admin/info");
  const url = new URL(res?.url() || "");

  expect(url.pathname).toMatch(".*/admin/info/edit$");
});
