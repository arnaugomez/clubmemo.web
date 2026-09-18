import { spawn, spawnSync } from "node:child_process";
import { startTestHttps } from "./e2e-https.mjs";
import { loadTestEnvironment } from "./test-environment.mjs";

const env = loadTestEnvironment();
const next = "node_modules/next/dist/bin/next";
const build = spawnSync(process.execPath, [next, "build", "--webpack"], {
  env,
  stdio: "inherit",
});
if (build.status !== 0) process.exit(build.status ?? 1);
const server = spawn(process.execPath, [next, "start"], {
  env,
  stdio: "inherit",
});
const closeHttps = startTestHttps();
process.on("exit", closeHttps);
for (const signal of ["SIGINT", "SIGTERM"])
  process.on(signal, () => server.kill(signal));
server.on("exit", (code) => process.exit(code ?? 0));
