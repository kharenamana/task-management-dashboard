import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

const sourceDirectory = fileURLToPath(
  new URL("./src", import.meta.url),
).replaceAll("\\", "/");
const serverOnlyStub = fileURLToPath(
  new URL("./src/test/server-only.ts", import.meta.url),
).replaceAll("\\", "/");

export default defineConfig({
  test: {
    environment: "jsdom",
    globals: true,
    pool: "forks",
    fileParallelism: false,
    maxWorkers: 1,
    setupFiles: ["./vitest.setup.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      exclude: ["**/*.d.ts", "src/types/database.generated.ts"],
    },
  },
  resolve: {
    alias: {
      "@": sourceDirectory,
      "server-only": serverOnlyStub,
    },
  },
});
