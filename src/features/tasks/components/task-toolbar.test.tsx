import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { TaskToolbar } from "@/features/tasks/components/task-toolbar";
import { defaultTaskQuery } from "@/features/tasks/filters";

describe("TaskToolbar", () => {
  it("exposes labeled search, filter, sort, clear, and create controls", async () => {
    const user = userEvent.setup();
    const onSearchChange = vi.fn();
    const onQueryChange = vi.fn();
    const onClear = vi.fn();
    const onCreate = vi.fn();

    render(
      <TaskToolbar
        query={{ ...defaultTaskQuery, priority: "high" }}
        searchValue="ship"
        onSearchChange={onSearchChange}
        onQueryChange={onQueryChange}
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
    await user.click(screen.getByRole("button", { name: "Clear" }));
    await user.click(screen.getByRole("button", { name: "New task" }));

    expect(onSearchChange).toHaveBeenLastCalledWith("review");
    expect(onQueryChange).toHaveBeenCalledWith("status", "completed");
    expect(onQueryChange).toHaveBeenCalledWith("priority", "low");
    expect(onQueryChange).toHaveBeenCalledWith("sort", "due_desc");
    expect(onClear).toHaveBeenCalledOnce();
    expect(onCreate).toHaveBeenCalledOnce();
  });
});
