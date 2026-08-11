import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { TaskList } from "@/features/tasks/components/task-list";
import type { Task } from "@/features/tasks/types";

const task: Task = {
  id: "a4e8e21c-2501-4af3-a5a4-c934bcb3ee89",
  title: "Ship dashboard",
  description: "Polish the responsive experience",
  status: "pending",
  priority: "high",
  dueDate: "2026-08-10",
  completedAt: null,
  createdAt: "2026-08-01T10:00:00.000Z",
  updatedAt: "2026-08-01T10:00:00.000Z",
};

describe("TaskList", () => {
  it("renders semantic task data and accessible actions", async () => {
    const user = userEvent.setup();
    const onToggle = vi.fn();
    const onEdit = vi.fn();
    const onDelete = vi.fn();
    render(
      <TaskList
        tasks={[task]}
        today="2026-08-11"
        onToggle={onToggle}
        onEdit={onEdit}
        onDelete={onDelete}
      />,
    );

    expect(screen.getAllByText("Ship dashboard")).not.toHaveLength(0);
    expect(screen.getAllByText(/Overdue/u)).not.toHaveLength(0);
    expect(screen.getByRole("columnheader", { name: "Task" })).toBeVisible();

    await user.click(
      screen.getAllByRole("button", { name: "Complete Ship dashboard" })[0]!,
    );
    await user.click(
      screen.getAllByRole("button", { name: "Edit Ship dashboard" })[0]!,
    );
    await user.click(
      screen.getAllByRole("button", { name: "Delete Ship dashboard" })[0]!,
    );

    expect(onToggle).toHaveBeenCalledWith(task);
    expect(onEdit).toHaveBeenCalledWith(task);
    expect(onDelete).toHaveBeenCalledWith(task);
  });
});
