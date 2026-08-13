import {
  defaultTaskQuery,
  taskQueryFromRecord,
} from "@/features/tasks/filters";

describe("taskQueryFromRecord", () => {
  it("preserves valid filters when another query value is invalid", () => {
    expect(
      taskQueryFromRecord({
        status: "completed",
        priority: "urgent",
        sort: "due_desc",
        page: "2",
      }),
    ).toEqual({
      status: "completed",
      sort: "due_desc",
      page: 2,
      pageSize: 20,
    });
  });

  it("falls back field by field and accepts the first repeated value", () => {
    expect(
      taskQueryFromRecord({ q: ["focus", "ignored"], page: "zero" }),
    ).toEqual({ ...defaultTaskQuery, q: "focus" });
  });
});
