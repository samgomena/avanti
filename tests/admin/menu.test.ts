import { test, expect } from "@playwright/test";

test("/admin/menu redirects", async ({ page }) => {
  const res = await page.goto("/admin/menu");
  const url = new URL(res?.url() || "");

  expect(url.pathname).toMatch(/.*\/admin\/menu\/add$/);
});
