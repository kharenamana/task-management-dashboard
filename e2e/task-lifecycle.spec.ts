import { expect, test } from "@playwright/test";

const email = process.env.E2E_USER_EMAIL;
const password = process.env.E2E_USER_PASSWORD;

function getCredentials() {
  if (!email || !password) {
    throw new Error("E2E credentials are not configured.");
  }
  return { email, password };
}

test.describe("authenticated task lifecycle", () => {
  test.skip(
    !email || !password,
    "Set E2E_USER_EMAIL and E2E_USER_PASSWORD for a confirmed test account.",
  );

  test("signs in, creates, completes, edits, and deletes a task", async ({
    page,
  }) => {
    const credentials = getCredentials();
    const uniqueId = `${Date.now()}-${test.info().workerIndex}`;
    const title = `E2E task ${uniqueId}`;
    const editedTitle = `${title} edited`;

    await page.goto("/login");
    await page.getByLabel("Email address").fill(credentials.email);
    await page.getByLabel("Password").fill(credentials.password);
    await page.getByRole("button", { name: "Sign in" }).click();

    await expect(page).toHaveURL(/\/dashboard(?:\?|$)/u);
    await expect(
      page.getByRole("heading", { name: "Make today count." }),
    ).toBeVisible();

    await page.getByRole("button", { name: "New task" }).click();
    await page.getByLabel("Title").fill(title);
    await page.getByLabel("Description").fill("Created by the E2E smoke flow");
    await page.getByLabel("Priority").selectOption("high");
    await page.getByRole("button", { name: "Create task" }).click();
    await expect(page.getByText("Task created", { exact: true })).toBeVisible();

    let row = page.getByRole("row").filter({ hasText: title });
    await expect(row).toBeVisible();
    await row.getByRole("button", { name: `Complete ${title}` }).click();
    await expect(
      page.getByText("Task completed", { exact: true }),
    ).toBeVisible();
    await expect(row.getByText("Completed", { exact: true })).toBeVisible();

    await row.getByRole("button", { name: `Edit ${title}` }).click();
    await page.getByLabel("Title").fill(editedTitle);
    await page.getByRole("button", { name: "Save changes" }).click();
    await expect(page.getByText("Task updated", { exact: true })).toBeVisible();

    row = page.getByRole("row").filter({ hasText: editedTitle });
    await expect(row).toBeVisible();
    await row.getByRole("button", { name: `Delete ${editedTitle}` }).click();
    await page.getByRole("button", { name: "Delete task" }).click();

    await expect(page.getByText("Task deleted", { exact: true })).toBeVisible();
    await expect(page.getByText(editedTitle, { exact: true })).toHaveCount(0);
  });
});
