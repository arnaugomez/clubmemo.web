import { readFileSync } from "node:fs";
import path from "node:path";
import dotenv from "dotenv";

/** Development supplies optional integrations; only test settings may select the database. */
export function loadTestEnvironment() {
  if (process.env.CI) {
    if (!process.env.MONGODB_URL)
      throw new Error("CI requires an isolated MONGODB_URL");
    return {
      ...process.env,
      FAKE_OPENAI_API: "true",
      SEND_EMAIL: "false",
      SENTRY_AUTH_TOKEN: "",
    };
  }
  const test = dotenv.parse(readFileSync(path.resolve(".env.test.local")));
  if (!test.MONGODB_URL)
    throw new Error(".env.test.local must supply an isolated MONGODB_URL");
  let development = {};
  try {
    development = dotenv.parse(
      readFileSync(path.resolve(".env.development.local")),
    );
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
  return {
    ...process.env,
    ...development,
    ...test,
    FAKE_OPENAI_API: "true",
    SEND_EMAIL: "false",
    SENTRY_AUTH_TOKEN: "",
  };
}
