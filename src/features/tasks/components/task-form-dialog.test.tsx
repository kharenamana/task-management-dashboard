import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const formMutationMocks = vi.hoisted(() => ({
  create: { isPending: false, mutateAsync: vi.fn() },
  update: { isPending: false, mutateAsync: vi.fn() },
}));

vi.mock("@/features/tasks/hooks/use-task-mutations", () => ({
  useCreateTask: () => formMutationMocks.create,
  useUpdateTask: () => formMutationMocks.update,
}));

import { TaskFormDialog } from "@/features/tasks/components/task-form-dialog";
import type { Task } from "@/features/tasks/types";

const task: Task = {
  id: "a4e8e21c-2501-4af3-a5a4-c934bcb3ee89",
  title: "Ship dashboard",
  description: "Review the release candidate.",
  status: "in_progress",
  priority: "high",
  dueDate: "2026-08-20",
  completedAt: null,
  createdAt: "2026-08-01T10:00:00.000Z",
  updatedAt: "2026-08-01T10:00:00.000Z",
};

describe("TaskFormDialog", () => {
  beforeEach(() => vi.clearAllMocks());

  it("validates and submits an accessible create form", async () => {
    formMutationMocks.create.mutateAsync.mockResolvedValue({ data: {} });
    const onOpenChange = vi.fn();
    const user = userEvent.setup();
    render(<TaskFormDialog open onOpenChange={onOpenChange} task={null} />);

    await user.click(screen.getByRole("button", { name: "Create task" }));
    expect(await screen.findByText("Enter a task title.")).toBeVisible();

    await user.type(screen.getByLabelText("Title"), "Ship dashboard");
    await user.selectOptions(screen.getByLabelText("Priority"), "high");
    await user.click(screen.getByRole("button", { name: "Create task" }));

    expect(formMutationMocks.create.mutateAsync).toHaveBeenCalledWith({
      title: "Ship dashboard",
      description: "",
      status: "pending",
      priority: "high",
      dueDate: null,
    });
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("renders the shared mobile-safe structure in edit mode", () => {
    render(<TaskFormDialog open onOpenChange={vi.fn()} task={task} />);

    const dialog = screen.getByRole("dialog", { name: "Edit task" });
    expect(dialog).toHaveClass("task-dialog-content", "overflow-hidden");
    expect(dialog.className).toContain("100dvh");
    expect(screen.getByTestId("task-dialog-scroll-region")).toHaveClass(
      "overflow-y-auto",
    );
    expect(screen.getByRole("button", { name: "Save changes" })).toBeVisible();
    expect(screen.getByLabelText("Title")).toHaveValue("Ship dashboard");
  });

  it("reports description length and warns before discarding dirty input", async () => {
    const confirm = vi.spyOn(window, "confirm").mockReturnValue(false);
    const onOpenChange = vi.fn();
    const user = userEvent.setup();
    render(<TaskFormDialog open onOpenChange={onOpenChange} task={null} />);

    await user.type(screen.getByLabelText("Title"), "Draft task");
    await user.type(screen.getByLabelText("Description (optional)"), "Plan");

    expect(screen.getByText("4 / 5,000 characters")).toBeVisible();
    await user.click(screen.getByRole("button", { name: "Close task form" }));

    expect(confirm).toHaveBeenCalledWith("Discard your unsaved task changes?");
    expect(onOpenChange).not.toHaveBeenCalled();
    expect(screen.getByLabelText("Title")).toHaveValue("Draft task");

    confirm.mockRestore();
  });

  it("preserves entered values after a recoverable server error", async () => {
    formMutationMocks.create.mutateAsync.mockRejectedValue(
      new Error("Task could not be saved."),
    );
    const user = userEvent.setup();
    render(<TaskFormDialog open onOpenChange={vi.fn()} task={null} />);

    await user.type(screen.getByLabelText("Title"), "Keep this draft");
    await user.click(screen.getByRole("button", { name: "Create task" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Task could not be saved.",
    );
    expect(screen.getByLabelText("Title")).toHaveValue("Keep this draft");
  });
});
