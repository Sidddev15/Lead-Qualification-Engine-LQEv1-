import { test, expect } from "@playwright/test";

test("Manual LQE flow shows results table", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("button", { name: "Manual" }).click();
  await page
    .getByLabel("Enter company names (comma or newline separated)")
    .fill("EEC Filters Pvt Ltd");

  await page.getByRole("button", { name: "Run LQE" }).click();

  await page.waitForURL("/lqe/results");

  await expect(page.getByText("EEC Filters Pvt Ltd")).toBeVisible();
  await expect(page.getByText("Tier")).toBeVisible();
});
