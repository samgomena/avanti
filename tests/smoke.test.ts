import { test, expect } from "@playwright/test";

test("has title", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/Avanti/);
});

test("has links", async ({ page }) => {
  await page.goto("/");

  expect(page.getByRole("link", { name: "About Us" })).toBeDefined();
  expect(page.getByRole("link", { name: "Special Events" })).toBeDefined();
  expect(page.getByRole("link", { name: "Avanti", exact: true })).toBeDefined();
  expect(page.getByRole("link", { name: "Some photos" })).toBeDefined();
  expect(page.getByRole("link", { name: "Contact Us" })).toBeDefined();
  expect(page.getByRole("link", { name: "Login" })).toBeDefined();

  // Menu is special cuz there's two links on the home page
  expect(
    page.getByRole("navigation").getByRole("link", { name: "Menu" })
  ).toBeDefined();
  expect(page.getByRole("link", { name: "Menu" }).nth(1)).toBeDefined();
  expect(page.getByRole("link", { name: "Reserve a Table" })).toBeDefined();
});
