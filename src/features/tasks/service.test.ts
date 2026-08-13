const serviceMocks = vi.hoisted(() => ({
  listTaskRows: vi.fn(),
  listTaskTitleRows: vi.fn(),
  createTaskRow: vi.fn(),
  updateTaskRow: vi.fn(),
  deleteTaskRow: vi.fn(),
  getTaskMetricCounts: vi.fn(),
}));

vi.mock("server-only", () => ({}));
vi.mock("@/features/tasks/repository", () => ({
  listTaskRows: serviceMocks.listTaskRows,
  listTaskTitleRows: serviceMocks.listTaskTitleRows,
  createTaskRow: serviceMocks.createTaskRow,
  updateTaskRow: serviceMocks.updateTaskRow,
  deleteTaskRow: serviceMocks.deleteTaskRow,
  getTaskMetricCounts: serviceMocks.getTaskMetricCounts,
}));

import { taskNotFoundError } from "@/features/tasks/errors";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database.generated";
import {
  createTask,
  deleteTask,
  getTaskMetrics,
  listTasks,
  listTaskSuggestions,
  updateTask,
} from "@/features/tasks/service";

const row = {
  id: "a4e8e21c-2501-4af3-a5a4-c934bcb3ee89",
  user_id: "6c56c766-b8aa-4c71-8183-80fdf1f0e169",
  title: "Ship dashboard",
  description: "Portfolio beta",
  status: "pending" as const,
  priority: "high" as const,
  due_date: null,
  completed_at: null,
  created_at: "2026-08-11T10:00:00.000Z",
  updated_at: "2026-08-11T10:00:00.000Z",
};
const client = { client: true } as unknown as SupabaseClient<Database>;

describe("task service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("maps private database rows to paginated public tasks", async () => {
    serviceMocks.listTaskRows.mockResolvedValue({ rows: [row], total: 21 });
    const query = {
      sort: "due_asc" as const,
      page: 2,
      pageSize: 20,
    };

    const result = await listTasks(client, row.user_id, query);

    expect(result.tasks[0]).toEqual({
      id: row.id,
      title: row.title,
      description: row.description,
      status: row.status,
      priority: row.priority,
      dueDate: null,
      completedAt: null,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    });
    expect(result.tasks[0]).not.toHaveProperty("user_id");
    expect(result.meta).toEqual({
      page: 2,
      pageSize: 20,
      total: 21,
      totalPages: 2,
    });
  });

  it("returns the trigger-controlled completion fields after create and update", async () => {
    serviceMocks.createTaskRow.mockResolvedValue({
      ...row,
      status: "completed",
      completed_at: "2026-08-11T11:00:00.000Z",
    });
    serviceMocks.updateTaskRow.mockResolvedValue({
      ...row,
      due_date: "2026-08-20",
    });

    await expect(
      createTask(client, row.user_id, {
        title: row.title,
        description: row.description,
        status: "completed",
        priority: "high",
        dueDate: null,
      }),
    ).resolves.toMatchObject({
      status: "completed",
      completedAt: expect.any(String),
    });
    await expect(
      updateTask(client, row.user_id, row.id, { dueDate: "2026-08-20" }),
    ).resolves.toMatchObject({ dueDate: "2026-08-20" });
  });

  it("deduplicates owner-scoped title suggestions case-insensitively", async () => {
    serviceMocks.listTaskTitleRows.mockResolvedValue([
      { title: "Review launch" },
      { title: "review launch" },
      { title: "Ship dashboard" },
    ]);
    const query = {
      q: "sh",
      status: "pending" as const,
      priority: "high" as const,
      limit: 2,
    };

    await expect(
      listTaskSuggestions(client, row.user_id, query),
    ).resolves.toEqual([
      { title: "Review launch" },
      { title: "Ship dashboard" },
    ]);
    expect(serviceMocks.listTaskTitleRows).toHaveBeenCalledWith(
      client,
      row.user_id,
      query,
    );
  });

  it("preserves ownership-safe not-found failures", async () => {
    serviceMocks.updateTaskRow.mockRejectedValue(taskNotFoundError());
    await expect(
      updateTask(client, row.user_id, row.id, { status: "completed" }),
    ).rejects.toMatchObject({ code: "TASK_NOT_FOUND", status: 404 });
  });

  it("delegates deletion and indexed metric counts", async () => {
    serviceMocks.deleteTaskRow.mockResolvedValue(undefined);
    serviceMocks.getTaskMetricCounts.mockResolvedValue({
      total: 8,
      completed: 3,
      pending: 5,
      overdue: 2,
    });

    await deleteTask(client, row.user_id, row.id);
    await expect(getTaskMetrics(client, "2026-08-11")).resolves.toEqual({
      total: 8,
      completed: 3,
      pending: 5,
      overdue: 2,
    });
    expect(serviceMocks.deleteTaskRow).toHaveBeenCalledWith(
      expect.anything(),
      row.user_id,
      row.id,
    );
    expect(serviceMocks.getTaskMetricCounts).toHaveBeenCalledWith(
      client,
      "2026-08-11",
    );
  });
});
