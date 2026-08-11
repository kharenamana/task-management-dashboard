import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { TaskToolbar } from "@/features/tasks/components/task-toolbar";
import { defaultTaskQuery } from "@/features/tasks/filters";

describe("TaskToolbar", () => {
  it("exposes labeled search, filter, sort, clear, and create controls", async () => {
    const user = userEvent.setup();
    const onSearchChange = vi.fn();
    const onSearchClear = vi.fn();
    const onQueryChange = vi.fn();
    const onFilterRemove = vi.fn();
    const onClear = vi.fn();
    const onCreate = vi.fn();

    render(
      <TaskToolbar
        query={{
          ...defaultTaskQuery,
          q: "ship",
          priority: "high",
          sort: "due_desc",
        }}
        searchValue="ship"
        onSearchChange={onSearchChange}
        onSearchClear={onSearchClear}
        onQueryChange={onQueryChange}
        onFilterRemove={onFilterRemove}
        onClear={onClear}
        onCreate={onCreate}
      />,
    );

    fireEvent.change(screen.getByLabelText("Search tasks by title"), {
      target: { value: "review" },
    });
    await user.selectOptions(
      screen.getByLabelText("Filter by status"),
      "completed",
    );
    await user.selectOptions(
      screen.getByLabelText("Filter by priority"),
      "low",
    );
    await user.selectOptions(
      screen.getByLabelText("Sort by due date"),
      "due_desc",
    );
    await user.click(
      screen.getByRole("button", { name: "Remove Search: ship filter" }),
    );
    await user.click(
      screen.getByRole("button", { name: "Remove Priority: High filter" }),
    );
    await user.click(screen.getByRole("button", { name: "Clear all" }));
    await user.click(screen.getByRole("button", { name: "New task" }));

    expect(onSearchChange).toHaveBeenLastCalledWith("review");
    expect(onQueryChange).toHaveBeenCalledWith("status", "completed");
    expect(onQueryChange).toHaveBeenCalledWith("priority", "low");
    expect(onQueryChange).toHaveBeenCalledWith("sort", "due_desc");
    expect(onSearchClear).toHaveBeenCalledOnce();
    expect(onFilterRemove).toHaveBeenCalledWith("priority");
    expect(onClear).toHaveBeenCalledOnce();
    expect(onCreate).toHaveBeenCalledOnce();
  });
});
