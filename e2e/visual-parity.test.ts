import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { expect, test } from "@playwright/test";

// Run with BASELINE_URL pointing to a checkout of dev using the same test environment.
test.describe("visual parity with dev", () => {
  test.skip(!process.env.BASELINE_URL, "Requires a running baseline checkout");
  for (const width of [390, 1280]) {
    for (const route of [
      "/",
      "/auth/login",
      "/auth/signup",
      "/auth/forgot-password",
    ]) {
      test(`${route} at ${width}px`, async ({ page }, info) => {
        test.setTimeout(150_000);
        await page.setViewportSize({ width, height: 900 });
        await page.goto(`${process.env.BASELINE_URL}${route}`);
        await page.evaluate(() => document.fonts.ready);
        await page.addStyleTag({
          content: "nextjs-portal { display: none !important; }",
        });
        const baselineText = await page.locator("main").innerText();
        const baseline = await page
          .locator("main")
          .screenshot({ animations: "disabled" });
        const name = `${route.replaceAll("/", "-") || "home"}-${width}.png`;
        const expectedPath = info.snapshotPath(name);
        await mkdir(path.dirname(expectedPath), { recursive: true });
        await writeFile(expectedPath, baseline);
        await page.goto(route);
        await page.evaluate(() => document.fonts.ready);
        await page.addStyleTag({
          content: "nextjs-portal { display: none !important; }",
        });
        await expect(page.locator("main")).toHaveText(baselineText, {
          useInnerText: true,
        });
        await expect(page.locator("main")).toHaveScreenshot(name, {
          animations: "disabled",
          maxDiffPixels: 0,
        });
      });
    }
  }
});
