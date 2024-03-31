import nextEnv from "@next/env";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig(() => {
  nextEnv.loadEnvConfig(process.cwd());
  return defineConfig({
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    plugins: [react(), tsconfigPaths()],
    test: {
      environment: "jsdom",
      include: [
        "./src/**/*.{test,spec}.{ts,tsx}",
        "./test/**/*.{test,spec}.{ts,tsx}",
      ],
    },
  });
});
