import {
  createTaskSchema,
  metricsQuerySchema,
  taskListQuerySchema,
  taskSuggestionQuerySchema,
  updateTaskSchema,
} from "@/features/tasks/schemas";

describe("task schemas", () => {
  it("normalizes create input and applies safe defaults", () => {
    expect(createTaskSchema.parse({ title: "  Ship dashboard  " })).toEqual({
      title: "Ship dashboard",
      description: "",
      status: "pending",
      priority: "medium",
      dueDate: null,
    });
  });

  it("rejects impossible calendar dates", () => {
    expect(
      createTaskSchema.safeParse({
        title: "Impossible",
        dueDate: "2026-02-30",
      }).success,
    ).toBe(false);
    expect(metricsQuerySchema.safeParse({ today: "2026-08-11" }).success).toBe(
      true,
    );
  });

  it("requires at least one update field", () => {
    const result = updateTaskSchema.safeParse({});
    expect(result.success).toBe(false);
  });

  it("rejects unexpected mutation fields", () => {
    expect(
      createTaskSchema.safeParse({
        title: "Try to change ownership",
        user_id: "6c56c766-b8aa-4c71-8183-80fdf1f0e169",
      }).success,
    ).toBe(false);
  });

  it("parses filters, pagination, and due-date sort", () => {
    expect(
      taskListQuerySchema.parse({
        q: "  launch  ",
        status: "in_progress",
        priority: "high",
        sort: "due_desc",
        page: "2",
        pageSize: "25",
      }),
    ).toEqual({
      q: "launch",
      status: "in_progress",
      priority: "high",
      sort: "due_desc",
      page: 2,
      pageSize: 25,
    });
  });

  it("bounds page size and search length", () => {
    expect(taskListQuerySchema.safeParse({ pageSize: "101" }).success).toBe(
      false,
    );
    expect(taskListQuerySchema.safeParse({ q: "x".repeat(101) }).success).toBe(
      false,
    );
  });

  it("validates and bounds suggestion requests", () => {
    expect(
      taskSuggestionQuerySchema.parse({
        q: "  ship  ",
        status: "pending",
        priority: "high",
      }),
    ).toEqual({
      q: "ship",
      status: "pending",
      priority: "high",
      limit: 6,
    });
    expect(taskSuggestionQuerySchema.safeParse({ q: "s" }).success).toBe(false);
    expect(
      taskSuggestionQuerySchema.safeParse({ q: "ship", limit: "7" }).success,
    ).toBe(false);
  });
});
