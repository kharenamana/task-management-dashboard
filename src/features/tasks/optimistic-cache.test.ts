import {
  optimisticallyDeleteTask,
  optimisticallyToggleTask,
} from "@/features/tasks/optimistic-cache";
import type { TaskListQuery } from "@/features/tasks/schemas";
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

const cache = {
  data: [task],
  meta: { page: 2, pageSize: 20, total: 21, totalPages: 2 },
};

function query(overrides: Partial<TaskListQuery> = {}): TaskListQuery {
  return {
    sort: "due_asc",
    page: 2,
    pageSize: 20,
    ...overrides,
  };
}

describe("optimistic task cache helpers", () => {
  it("decrements every matching page but leaves unrelated filter totals intact", () => {
    const anotherPage = { ...cache, data: [] };
    const matching = optimisticallyDeleteTask(
      anotherPage,
      query({ priority: "medium" }),
      task,
    );
    const unrelated = optimisticallyDeleteTask(
      cache,
      query({ priority: "high" }),
      task,
    );

    expect(matching.meta).toMatchObject({ total: 20, totalPages: 1 });
    expect(unrelated.meta).toMatchObject({ total: 21, totalPages: 2 });
    expect(unrelated.data).toEqual([]);
  });

  it("updates totals when a status change enters or leaves a cached filter", () => {
    const completedTask: Task = {
      ...task,
      status: "completed",
      completedAt: "2026-08-11T10:00:00.000Z",
    };
    const pending = optimisticallyToggleTask(
      cache,
      query({ status: "pending" }),
      task,
      completedTask,
    );
    const completed = optimisticallyToggleTask(
      { ...cache, data: [] },
      query({ status: "completed" }),
      task,
      completedTask,
    );

    expect(pending.data).toEqual([]);
    expect(pending.meta?.total).toBe(20);
    expect(completed.meta?.total).toBe(22);
  });
});
