import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import {
  TaskEmptyState,
  TaskErrorState,
  TaskLoading,
} from "@/features/tasks/components/task-state";

describe("task states", () => {
  it("announces loading and exposes a retry action for failures", async () => {
    const retry = vi.fn();
    const user = userEvent.setup();
    const { rerender } = render(<TaskLoading />);

    expect(screen.getByRole("status", { name: "Loading tasks" })).toBeVisible();
    rerender(<TaskErrorState retry={retry} />);
    expect(screen.getByRole("alert")).toHaveTextContent(
      "Tasks could not be loaded",
    );
    await user.click(screen.getByRole("button", { name: "Try again" }));
    expect(retry).toHaveBeenCalledOnce();
  });

  it("distinguishes a new workspace from an empty search", async () => {
    const create = vi.fn();
    const clearFilters = vi.fn();
    const user = userEvent.setup();
    const { rerender } = render(
      <TaskEmptyState
        filtered={false}
        create={create}
        clearFilters={clearFilters}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Create first task" }));
    expect(create).toHaveBeenCalledOnce();

    rerender(
      <TaskEmptyState filtered create={create} clearFilters={clearFilters} />,
    );
    expect(
      screen.getByRole("heading", { name: "No matching tasks" }),
    ).toBeVisible();
    await user.click(screen.getByRole("button", { name: "Clear filters" }));
    expect(clearFilters).toHaveBeenCalledOnce();
  });
});
