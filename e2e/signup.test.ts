import { randomUUID } from "node:crypto";
import { expect, test } from "@playwright/test";
import { MongoClient } from "mongodb";
import { testSetting } from "./environment";

test("sign up from the landing page", async ({ page }) => {
  const email = `signup-${randomUUID()}@test.com`;
  const client = new MongoClient(testSetting("MONGODB_URL"));
  await client.connect();
  const db = client.db();
  try {
    await page.goto("/");
    await page.getByTestId("signup-button-1").click();
    await expect(page.getByTestId("signup-title")).toHaveText(
      "Crea tu usuario",
    );
    await page.getByTestId("email").fill(email);
    await page.getByTestId("password").fill("test-password-123");
    await page.getByTestId("acceptTerms").click();
    await page.getByTestId("submit").click();
    await expect(page.getByTestId("verify-email-title")).toContainText(
      "Ya casi estamos",
    );
  } finally {
    const user = await db.collection("users").findOne({ email });
    if (user) {
      await db.collection("profiles").deleteMany({ userId: user._id });
      await db.collection("sessions").deleteMany({ user_id: user._id });
      await db
        .collection("emailVerificationCodes")
        .deleteMany({ userId: user._id });
      await db.collection("users").deleteOne({ _id: user._id });
    }
    await client.close();
  }
});
