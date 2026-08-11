import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const dialogMocks = vi.hoisted(() => ({
  removeTask: vi.fn(),
  toastError: vi.fn(),
  toastSuccess: vi.fn(),
}));

vi.mock("@/features/tasks/api-client", () => ({
  removeTask: dialogMocks.removeTask,
}));
vi.mock("sonner", () => ({
  toast: {
    error: dialogMocks.toastError,
    success: dialogMocks.toastSuccess,
  },
}));

import { DeleteTaskDialog } from "@/features/tasks/components/delete-task-dialog";
import type { Task } from "@/features/tasks/types";

const task: Task = {
  id: "a4e8e21c-2501-4af3-a5a4-c934bcb3ee89",
  title: "Ship dashboard",
  description: "",
  status: "pending",
  priority: "medium",
  dueDate: null,
  completedAt: null,
  createdAt: "2026-08-01T10:00:00.000Z",
  updatedAt: "2026-08-01T10:00:00.000Z",
};

function renderDialog(onClose = vi.fn()) {
  const queryClient = new QueryClient({
    defaultOptions: { mutations: { retry: false } },
  });
  render(
    <QueryClientProvider client={queryClient}>
      <DeleteTaskDialog task={task} onClose={onClose} />
    </QueryClientProvider>,
  );
  return onClose;
}

describe("DeleteTaskDialog", () => {
  beforeEach(() => vi.clearAllMocks());

  it("keeps context open and exposes a recoverable deletion error", async () => {
    dialogMocks.removeTask.mockRejectedValue(new Error("Deletion failed"));
    const onClose = renderDialog();

    await userEvent.click(screen.getByRole("button", { name: "Delete task" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Deletion failed",
    );
    expect(onClose).not.toHaveBeenCalled();
  });

  it("closes only after deletion succeeds", async () => {
    dialogMocks.removeTask.mockResolvedValue(undefined);
    const onClose = renderDialog();

    await userEvent.click(screen.getByRole("button", { name: "Delete task" }));

    await waitFor(() => expect(onClose).toHaveBeenCalledOnce());
  });
});
