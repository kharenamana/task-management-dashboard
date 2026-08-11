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
});
