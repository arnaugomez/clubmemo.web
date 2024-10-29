import test, { expect } from "@playwright/test";
import { MongoClient, ServerApiVersion } from "mongodb";

/**
 * Generates a unique email for each test
 *
 * @param browserName the name of the browser where the e2e test is running
 * @returns an email string that is unique for each test
 */
const createEmail = (browserName: string) =>
  `signup-test-${browserName}@test.com`;

/**
 * Deletes the data from previous e2e tests so that
 * it does not interfere with the current test
 */
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
  await page.getByTestId("password").fill("test-password-123");
  await page.getByTestId("acceptTerms").click();
  await page.getByTestId("submit").click();
  titleText = await page.getByTestId("verify-email-title").textContent();
  expect(titleText).toContain("Ya casi estamos");
});
