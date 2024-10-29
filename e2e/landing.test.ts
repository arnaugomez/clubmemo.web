import { expect, test } from "@playwright/test";

/**
 * Example test for the landing page. Used for demonstration purposes.
 */
test("Has title", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/clubmemo/);
});
