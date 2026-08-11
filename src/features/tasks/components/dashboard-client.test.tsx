import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const dashboardMocks = vi.hoisted(() => ({
  replace: vi.fn(),
  searchParams: new URLSearchParams(),
  toggle: vi.fn(),
  remove: vi.fn(),
  meta: { page: 1, pageSize: 20, total: 0, totalPages: 0 },
}));

vi.mock("next/navigation", () => ({
  usePathname: () => "/dashboard",
  useRouter: () => ({ replace: dashboardMocks.replace }),
  useSearchParams: () => dashboardMocks.searchParams,
}));

vi.mock("@/features/tasks/hooks/use-tasks", () => ({
  useTasks: () => ({
    data: {
      data: [],
      meta: dashboardMocks.meta,
    },
    isError: false,
    isFetching: false,
    isPending: false,
    isSuccess: true,
  }),
  useTaskMetrics: () => ({
    data: { data: { total: 0, completed: 0, pending: 0, overdue: 0 } },
    isError: false,
    isPending: false,
  }),
}));

vi.mock("@/features/tasks/hooks/use-task-mutations", () => ({
  useCreateTask: () => ({ isPending: false, mutateAsync: vi.fn() }),
  useDeleteTask: () => ({ mutate: dashboardMocks.remove }),
  useToggleTask: () => ({
    isPending: false,
    mutate: dashboardMocks.toggle,
  }),
  useUpdateTask: () => ({ isPending: false, mutateAsync: vi.fn() }),
}));

import { DashboardClient } from "@/features/tasks/components/dashboard-client";
import { defaultTaskQuery } from "@/features/tasks/filters";

describe("DashboardClient", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    dashboardMocks.replace.mockClear();
    dashboardMocks.searchParams = new URLSearchParams();
    dashboardMocks.meta = {
      page: 1,
      pageSize: 20,
      total: 0,
      totalPages: 0,
    };
  });

  afterEach(() => vi.useRealTimers());

  it("debounces title search and resets pagination in the URL", () => {
    render(<DashboardClient initialQuery={defaultTaskQuery} />);

    fireEvent.change(screen.getByLabelText("Search tasks by title"), {
      target: { value: "ship" },
    });
    act(() => vi.advanceTimersByTime(349));
    expect(dashboardMocks.replace).not.toHaveBeenCalled();

    act(() => vi.advanceTimersByTime(1));
    expect(dashboardMocks.replace).toHaveBeenCalledWith("/dashboard?q=ship", {
      scroll: false,
    });
  });

  it("moves focus to task results after pagination settles", async () => {
    vi.useRealTimers();
    dashboardMocks.meta = {
      page: 1,
      pageSize: 20,
      total: 25,
      totalPages: 2,
    };
    const user = userEvent.setup();
    const { rerender } = render(
      <DashboardClient initialQuery={defaultTaskQuery} />,
    );

    await user.click(screen.getByRole("button", { name: "Next" }));
    expect(dashboardMocks.replace).toHaveBeenCalledWith("/dashboard?page=2", {
      scroll: false,
    });

    dashboardMocks.searchParams = new URLSearchParams("page=2");
    dashboardMocks.meta = { ...dashboardMocks.meta, page: 2 };
    rerender(<DashboardClient initialQuery={defaultTaskQuery} />);

    await waitFor(() =>
      expect(screen.getByRole("heading", { name: "Tasks" })).toHaveFocus(),
    );
  });
});
