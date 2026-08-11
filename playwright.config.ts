import { existsSync } from "node:fs";

import { defineConfig, devices } from "@playwright/test";

if (existsSync(".env.test.local")) {
  process.loadEnvFile(".env.test.local");
}

const baseURL = process.env.E2E_BASE_URL ?? "http://127.0.0.1:3000";
const windowsBrowserExecutable =
  process.platform === "win32"
    ? [
        "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
        "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
        "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
        "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
      ].find((path) => existsSync(path))
    : undefined;

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  workers: 1,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [["line"], ["html", { open: "never" }]] : "list",
  use: {
    baseURL,
    ...(windowsBrowserExecutable
      ? { launchOptions: { executablePath: windowsBrowserExecutable } }
      : {}),
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: windowsBrowserExecutable ? "off" : "retain-on-failure",
  },
  ...(!process.env.E2E_BASE_URL
    ? {
        webServer: {
          command: "pnpm dev",
          url: baseURL,
          reuseExistingServer: !process.env.CI,
          timeout: 120_000,
        },
      }
    : {}),
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
