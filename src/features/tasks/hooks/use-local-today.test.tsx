import { act, renderHook } from "@testing-library/react";

import { useLocalToday } from "@/features/tasks/hooks/use-local-today";

describe("useLocalToday", () => {
  afterEach(() => vi.useRealTimers());

  it("rolls to the next local date after midnight", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 7, 11, 23, 59, 59, 900));
    const { result } = renderHook(() => useLocalToday());

    expect(result.current).toBe("2026-08-11");
    act(() => vi.advanceTimersByTime(200));
    expect(result.current).toBe("2026-08-12");
  });

  it("refreshes when the window regains focus", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 7, 11, 10));
    const { result } = renderHook(() => useLocalToday());
    vi.setSystemTime(new Date(2026, 7, 12, 10));

    act(() => window.dispatchEvent(new Event("focus")));
    expect(result.current).toBe("2026-08-12");
  });
});
