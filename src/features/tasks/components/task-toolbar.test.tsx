import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { TaskToolbar } from "@/features/tasks/components/task-toolbar";
import { defaultTaskQuery } from "@/features/tasks/filters";

describe("TaskToolbar", () => {
  it("exposes labeled search, filter, sort, clear, and create controls", async () => {
    const user = userEvent.setup();
    const onSearchChange = vi.fn();
    const onSearchSubmit = vi.fn();
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
        suggestions={[]}
        suggestionState="success"
        onSearchChange={onSearchChange}
        onSearchSubmit={onSearchSubmit}
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
    await user.click(screen.getByRole("button", { name: "Search" }));
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
    expect(onSearchSubmit).toHaveBeenCalledWith("ship");
    expect(onQueryChange).toHaveBeenCalledWith("status", "completed");
    expect(onQueryChange).toHaveBeenCalledWith("priority", "low");
    expect(onQueryChange).toHaveBeenCalledWith("sort", "due_desc");
    expect(onSearchClear).toHaveBeenCalledOnce();
    expect(onFilterRemove).toHaveBeenCalledWith("priority");
    expect(onClear).toHaveBeenCalledOnce();
    expect(onCreate).toHaveBeenCalledOnce();
  });

  it("supports keyboard suggestion selection and Escape dismissal", async () => {
    const user = userEvent.setup();
    const onSearchChange = vi.fn();
    const onSearchSubmit = vi.fn();
    render(
      <TaskToolbar
        query={defaultTaskQuery}
        searchValue="sh"
        suggestions={[{ title: "Ship dashboard" }, { title: "Share plan" }]}
        suggestionState="success"
        onSearchChange={onSearchChange}
        onSearchSubmit={onSearchSubmit}
        onSearchClear={vi.fn()}
        onQueryChange={vi.fn()}
        onFilterRemove={vi.fn()}
        onClear={vi.fn()}
        onCreate={vi.fn()}
      />,
    );
    const search = screen.getByRole("combobox", {
      name: "Search tasks by title",
    });

    await user.click(search);
    expect(screen.getByRole("listbox")).toBeVisible();
    await user.keyboard("{ArrowDown}{Enter}");

    expect(onSearchChange).toHaveBeenCalledWith("Ship dashboard");
    expect(onSearchSubmit).toHaveBeenCalledWith("Ship dashboard");
    expect(search).toHaveAttribute("aria-expanded", "false");

    await user.click(search);
    await user.keyboard("{Escape}");
    expect(search).toHaveAttribute("aria-expanded", "false");
  });

  it("clears the draft and committed search and restores input focus", async () => {
    const user = userEvent.setup();
    const onSearchClear = vi.fn();
    render(
      <TaskToolbar
        query={{ ...defaultTaskQuery, q: "ship" }}
        searchValue="shipment"
        suggestions={[]}
        suggestionState="success"
        onSearchChange={vi.fn()}
        onSearchSubmit={vi.fn()}
        onSearchClear={onSearchClear}
        onQueryChange={vi.fn()}
        onFilterRemove={vi.fn()}
        onClear={vi.fn()}
        onCreate={vi.fn()}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Clear" }));

    expect(onSearchClear).toHaveBeenCalledOnce();
    await waitFor(() =>
      expect(
        screen.getByRole("combobox", { name: "Search tasks by title" }),
      ).toHaveFocus(),
    );
  });
});
