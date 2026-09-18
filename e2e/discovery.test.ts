import { randomUUID } from "node:crypto";
import { expect, test } from "@playwright/test";
import { MongoClient } from "mongodb";
import { testSetting } from "./environment";

test("Atlas discovery searches and paginates public courses", async ({
  page,
}) => {
  test.setTimeout(120_000);
  const client = new MongoClient(testSetting("MONGODB_URL"));
  await client.connect();
  const courses = client.db().collection("courses");
  const prefix = `effect${randomUUID().replaceAll("-", "").slice(0, 8)}`;
  const inserted = await courses.insertMany(
    Array.from({ length: 25 }, (_, index) => ({
      name: `${prefix} course ${String(index).padStart(2, "0")}`,
      isPublic: true,
      tags: [prefix],
    })),
  );
  try {
    const indexes = await courses.listSearchIndexes("courses").toArray();
    expect(
      indexes.some((index) => "queryable" in index && index.queryable),
    ).toBe(true);
    // Atlas indexing is asynchronous. Poll the search itself before exercising UI pagination.
    await expect
      .poll(
        async () => {
          const results = await courses
            .aggregate([
              {
                $search: {
                  index: "courses",
                  autocomplete: { query: prefix, path: "name" },
                },
              },
              { $count: "count" },
            ])
            .toArray();
          return results[0]?.count ?? 0;
        },
        { timeout: 60_000, intervals: [500, 1000, 2000] },
      )
      .toBe(25);
    await page.goto(`/discover?query=${prefix}`);
    const results = page.getByRole("heading", { name: new RegExp(prefix) });
    await expect(results.first()).toBeVisible();
    for (let batch = 0; batch < 4 && (await results.count()) < 25; batch++) {
      await page.locator("footer").scrollIntoViewIfNeeded();
      await expect
        .poll(() => results.count())
        .toBeGreaterThan(Math.min(batch * 12, 24));
      await page.mouse.wheel(0, 2500);
      await page.waitForTimeout(1000);
    }
    await expect(results).toHaveCount(25);
    const names = await results.allTextContents();
    expect(new Set(names).size).toBe(25);
    await results.first().click();
    await expect(page).toHaveURL(/\/courses\/detail\/[a-f0-9]+$/);
  } finally {
    await courses.deleteMany({
      _id: { $in: Object.values(inserted.insertedIds) },
    });
    await client.close();
  }
});
