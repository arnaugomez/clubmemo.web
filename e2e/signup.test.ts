import test, { expect } from "@playwright/test";
import { MongoClient, ServerApiVersion } from "mongodb";

const createEmail = (browserName: string) =>
  `signup-test-${browserName}@test.com`;

test.beforeEach(async ({ page, browserName }) => {
  const mongoClient = new MongoClient(process.env.MONGODB_URL, {
    serverApi: {
      version: ServerApiVersion.v1,
      deprecationErrors: true,
    },
  });
  await mongoClient.connect();
  await mongoClient
    .db()
    .collection("users")
    .deleteOne({ email: createEmail(browserName) });
  await page.goto("/");
});

test("Sign up with email and password from landing page", async ({
  page,
  browserName,
}) => {
  await page.getByTestId("signup-button-1").click();

  let titleText = await page.getByTestId("signup-title").textContent();
  expect(titleText).toBe("Crea tu usuario");
  await page.getByTestId("email").fill(createEmail(browserName));
  await page.getByTestId("password").fill("TestPassword123");
  await page.getByTestId("acceptTerms").click();
  await page.getByTestId("submit").click();
  titleText = await page.getByTestId("verify-email-title").textContent();
  expect(titleText).toContain("Ya casi estamos");
});
