import { NextRequest, NextResponse } from "next/server";

const routeMocks = vi.hoisted(() => ({
  requireApiUser: vi.fn(),
  listTasks: vi.fn(),
  createTask: vi.fn(),
  updateTask: vi.fn(),
  deleteTask: vi.fn(),
  getTaskMetrics: vi.fn(),
}));

vi.mock("server-only", () => ({}));
vi.mock("@/features/auth/api", () => ({
  requireApiUser: routeMocks.requireApiUser,
}));
vi.mock("@/features/tasks/service", () => ({
  listTasks: routeMocks.listTasks,
  createTask: routeMocks.createTask,
  updateTask: routeMocks.updateTask,
  deleteTask: routeMocks.deleteTask,
  getTaskMetrics: routeMocks.getTaskMetrics,
}));

import { DELETE, PATCH } from "@/app/api/tasks/[taskId]/route";
import { GET as GET_METRICS } from "@/app/api/tasks/metrics/route";
import { GET, POST } from "@/app/api/tasks/route";
import { taskNotFoundError } from "@/features/tasks/errors";

const userId = "6c56c766-b8aa-4c71-8183-80fdf1f0e169";
const client = { authenticated: true };
const taskId = "a4e8e21c-2501-4af3-a5a4-c934bcb3ee89";
const task = {
  id: taskId,
  title: "Ship dashboard",
  description: "",
  status: "pending",
  priority: "medium",
  dueDate: null,
  completedAt: null,
  createdAt: "2026-08-11T10:00:00.000Z",
  updatedAt: "2026-08-11T10:00:00.000Z",
};

describe("task route handlers", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    routeMocks.requireApiUser.mockResolvedValue({ ok: true, userId, client });
  });

  it("returns 401 before parsing task input when authentication is absent", async () => {
    routeMocks.requireApiUser.mockResolvedValue({
      ok: false,
      response: NextResponse.json(
        { error: { code: "UNAUTHENTICATED", message: "Sign in to continue." } },
        { status: 401 },
      ),
    });

    const response = await POST(
      new NextRequest("http://localhost:3000/api/tasks", {
        method: "POST",
        body: "not-json",
      }),
    );
    expect(response.status).toBe(401);
    expect(routeMocks.createTask).not.toHaveBeenCalled();
  });

  it("validates and parses list query parameters", async () => {
    routeMocks.listTasks.mockResolvedValue({
      tasks: [task],
      meta: { page: 2, pageSize: 10, total: 11, totalPages: 2 },
    });
    const response = await GET(
      new NextRequest(
        "http://localhost:3000/api/tasks?q=ship&status=pending&priority=medium&sort=due_desc&page=2&pageSize=10",
      ),
    );
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.meta.total).toBe(11);
    expect(routeMocks.listTasks).toHaveBeenCalledWith(client, userId, {
      q: "ship",
      status: "pending",
      priority: "medium",
      sort: "due_desc",
      page: 2,
      pageSize: 10,
    });
  });

  it("returns field-safe 400 responses for invalid create input", async () => {
    const response = await POST(
      new NextRequest("http://localhost:3000/api/tasks", {
        method: "POST",
        body: JSON.stringify({ title: "" }),
      }),
    );
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.error.code).toBe("VALIDATION_ERROR");
    expect(body.error.fieldErrors.title).toBe("Enter a task title.");
  });

  it("creates validated owner-scoped tasks", async () => {
    routeMocks.createTask.mockResolvedValue(task);
    const response = await POST(
      new NextRequest("http://localhost:3000/api/tasks", {
        method: "POST",
        body: JSON.stringify({ title: "Ship dashboard" }),
      }),
    );

    expect(response.status).toBe(201);
    expect(routeMocks.createTask).toHaveBeenCalledWith(client, userId, {
      title: "Ship dashboard",
      description: "",
      status: "pending",
      priority: "medium",
      dueDate: null,
    });
  });

  it("returns the same 404 for absent or non-owned task IDs", async () => {
    routeMocks.updateTask.mockRejectedValue(taskNotFoundError());
    const response = await PATCH(
      new NextRequest(`http://localhost:3000/api/tasks/${taskId}`, {
        method: "PATCH",
        body: JSON.stringify({ status: "completed" }),
      }),
      { params: Promise.resolve({ taskId }) },
    );

    expect(response.status).toBe(404);
    await expect(response.json()).resolves.toEqual({
      error: { code: "TASK_NOT_FOUND", message: "Task not found." },
    });
  });

  it("deletes an owned task with a standardized response", async () => {
    routeMocks.deleteTask.mockResolvedValue(undefined);
    const response = await DELETE(
      new NextRequest(`http://localhost:3000/api/tasks/${taskId}`, {
        method: "DELETE",
      }),
      { params: Promise.resolve({ taskId }) },
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ data: null });
  });

  it("validates the local metric date and returns metric definitions", async () => {
    const invalid = await GET_METRICS(
      new NextRequest(
        "http://localhost:3000/api/tasks/metrics?today=2026-02-30",
      ),
    );
    expect(invalid.status).toBe(400);

    routeMocks.getTaskMetrics.mockResolvedValue({
      total: 8,
      completed: 3,
      pending: 5,
      overdue: 2,
    });
    const response = await GET_METRICS(
      new NextRequest(
        "http://localhost:3000/api/tasks/metrics?today=2026-08-11",
      ),
    );
    await expect(response.json()).resolves.toEqual({
      data: { total: 8, completed: 3, pending: 5, overdue: 2 },
    });
  });
});
