import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";

const mutationMocks = vi.hoisted(() => ({
  patchTask: vi.fn(),
  postTask: vi.fn(),
  removeTask: vi.fn(),
  toastError: vi.fn(),
  toastSuccess: vi.fn(),
}));

vi.mock("@/features/tasks/api-client", () => ({
  patchTask: mutationMocks.patchTask,
  postTask: mutationMocks.postTask,
  removeTask: mutationMocks.removeTask,
}));
vi.mock("sonner", () => ({
  toast: {
    error: mutationMocks.toastError,
    success: mutationMocks.toastSuccess,
  },
}));

import { taskKeys } from "@/features/tasks/query-keys";
import { useToggleTask } from "@/features/tasks/hooks/use-task-mutations";
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

describe("useToggleTask", () => {
  it("optimistically respects filters and rolls back a failed completion", async () => {
    let rejectRequest: (error: Error) => void = () => undefined;
    mutationMocks.patchTask.mockReturnValue(
      new Promise((_resolve, reject) => {
        rejectRequest = reject;
      }),
    );
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });
    const query = {
      status: "pending" as const,
      sort: "due_asc" as const,
      page: 1,
      pageSize: 20,
    };
    const key = taskKeys.list(query);
    queryClient.setQueryData(key, {
      data: [task],
      meta: { page: 1, pageSize: 20, total: 1, totalPages: 1 },
    });
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
    const { result } = renderHook(() => useToggleTask(), { wrapper });

    act(() => result.current.mutate(task));
    await waitFor(() =>
      expect(queryClient.getQueryData<{ data: Task[] }>(key)?.data).toEqual([]),
    );

    act(() => rejectRequest(new Error("Network unavailable")));
    await waitFor(() =>
      expect(queryClient.getQueryData<{ data: Task[] }>(key)?.data).toEqual([
        task,
      ]),
    );
    expect(mutationMocks.toastError).toHaveBeenCalledWith(
      "Network unavailable",
    );
  });
});
