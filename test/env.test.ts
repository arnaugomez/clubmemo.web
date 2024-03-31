import { expect, test } from "vitest";

test("env variables are correctly loaded", () => {
  expect(
    process.env.SEND_EMAIL,
    "value of SEND_EMAIL env var is false in test env",
  ).equals("false");
});
