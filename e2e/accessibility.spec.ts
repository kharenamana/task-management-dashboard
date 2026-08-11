import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

const email = process.env.E2E_USER_EMAIL;
const password = process.env.E2E_USER_PASSWORD;

async function expectNoBlockingViolations(page: Page) {
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();
  const blocking = results.violations
    .filter(({ impact }) => impact === "serious" || impact === "critical")
    .map(({ id, impact, nodes }) => ({
      id,
      impact,
      targets: nodes.map(({ target }) => target),
    }));

  expect(blocking, "serious or critical accessibility violations").toEqual([]);
}

test("public and authentication surfaces have no blocking axe findings", async ({
  page,
}) => {
  for (const path of ["/", "/architecture", "/login"]) {
    await page.goto(path);
    await expect(page.locator("main")).toBeVisible();
    await expectNoBlockingViolations(page);
  }
});

test("reduced-motion preference removes marketing entrance animation", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");

  await expect(page.locator(".animate-enter").first()).toHaveCSS(
    "animation-name",
    "none",
  );
});

test("landing page avoids Supabase runtime requests", async ({ page }) => {
  const supabaseRequests: string[] = [];
  page.on("request", (request) => {
    if (request.url().includes("supabase.co")) {
      supabaseRequests.push(request.url());
    }
  });

  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  expect(supabaseRequests).toEqual([]);
});

test("authenticated dashboard has no blocking axe findings", async ({
  page,
}) => {
  test.skip(
    !email || !password,
    "Set E2E_USER_EMAIL and E2E_USER_PASSWORD for the confirmed test account.",
  );

  await page.goto("/login");
  await page.getByLabel("Email address").fill(email!);
  await page.getByLabel("Password").fill(password!);
  await page.getByRole("button", { name: "Sign in" }).click();
  await expect(page).toHaveURL(/\/dashboard(?:\?|$)/u);
  await expect(
    page.getByRole("heading", { name: "Make today count." }),
  ).toBeVisible();
  await expectNoBlockingViolations(page);
});
