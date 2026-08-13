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
    await page
      .getByLabel("Password", { exact: true })
      .fill(credentials.password);
    await page.getByRole("button", { name: "Sign in" }).click();

    await expect(page).toHaveURL(/\/dashboard(?:\?|$)/u);
    await expect(
      page.getByRole("heading", { name: "Make today count." }),
    ).toBeVisible();

    await page.setViewportSize({ width: 390, height: 844 });
    await page.getByRole("button", { name: "New task" }).click();
    const mobileDialog = page.getByRole("dialog", { name: "Create a task" });
    await expect(mobileDialog).toBeVisible();
    const dialogBox = await mobileDialog.boundingBox();
    expect(dialogBox).not.toBeNull();
    expect(dialogBox!.x).toBeGreaterThanOrEqual(0);
    expect(dialogBox!.y).toBeGreaterThanOrEqual(0);
    expect(dialogBox!.x + dialogBox!.width).toBeLessThanOrEqual(390);
    expect(dialogBox!.y + dialogBox!.height).toBeLessThanOrEqual(844);
    expect(Math.abs(dialogBox!.x + dialogBox!.width / 2 - 195)).toBeLessThan(3);
    expect(Math.abs(dialogBox!.y + dialogBox!.height / 2 - 422)).toBeLessThan(
      3,
    );
    await expect(
      mobileDialog.getByRole("button", { name: "Create task" }),
    ).toBeVisible();
    await mobileDialog.getByRole("button", { name: "Close task form" }).click();

    await page.setViewportSize({ width: 1280, height: 720 });
    await page.getByRole("button", { name: "New task" }).click();
    const createDialog = page.getByRole("dialog", { name: "Create a task" });
    await createDialog.getByLabel("Title", { exact: true }).fill(title);
    await createDialog
      .getByLabel("Description", { exact: false })
      .fill("Created by the E2E smoke flow");
    await createDialog.getByLabel("Priority").selectOption("high");
    await createDialog.getByRole("button", { name: "Create task" }).click();
    await expect(page.getByText("Task created", { exact: true })).toBeVisible();

    const search = page.getByRole("combobox", {
      name: "Search tasks by title",
    });
    await search.fill(title.slice(0, 8));
    await expect(page.getByRole("listbox")).toBeVisible();
    await expect(page.getByRole("option", { name: title })).toBeVisible();
    await search.press("ArrowDown");
    await search.press("Enter");
    await expect
      .poll(() => new URL(page.url()).searchParams.get("q"))
      .toBe(title);

    let row = page.getByRole("row").filter({ hasText: title });
    await expect(row).toBeVisible();
    await row.getByRole("button", { name: `Complete ${title}` }).click();
    await expect(
      page.getByText("Task completed", { exact: true }),
    ).toBeVisible();
    await expect(row.getByText("Completed", { exact: true })).toBeVisible();

    await row.getByRole("button", { name: `Edit ${title}` }).click();
    const editDialog = page.getByRole("dialog", { name: "Edit task" });
    const editDialogBox = await editDialog.boundingBox();
    expect(editDialogBox).not.toBeNull();
    expect(
      Math.abs(editDialogBox!.x + editDialogBox!.width / 2 - 640),
    ).toBeLessThan(3);
    expect(
      Math.abs(editDialogBox!.y + editDialogBox!.height / 2 - 360),
    ).toBeLessThan(3);
    await editDialog.getByLabel("Title", { exact: true }).fill(editedTitle);
    await editDialog.getByRole("button", { name: "Save changes" }).click();
    await expect(page.getByText("Task updated", { exact: true })).toBeVisible();

    row = page.getByRole("row").filter({ hasText: editedTitle });
    await expect(row).toBeVisible();
    await row.getByRole("button", { name: `Delete ${editedTitle}` }).click();
    await page.getByRole("button", { name: "Delete task" }).click();

    await expect(page.getByText("Task deleted", { exact: true })).toBeVisible();
    await expect(page.getByText(editedTitle, { exact: true })).toHaveCount(0);
  });
});
