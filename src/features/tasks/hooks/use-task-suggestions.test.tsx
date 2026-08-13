import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook } from "@testing-library/react";
import { useState, type ReactNode } from "react";

const suggestionMocks = vi.hoisted(() => ({
  getTaskSuggestions: vi.fn(),
}));

vi.mock("@/features/tasks/api-client", () => ({
  getTaskSuggestions: suggestionMocks.getTaskSuggestions,
}));

import { useTaskSuggestions } from "@/features/tasks/hooks/use-task-suggestions";

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  };
}

describe("useTaskSuggestions", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();
    suggestionMocks.getTaskSuggestions.mockResolvedValue({
      data: [{ title: "Ship dashboard" }],
    });
  });

  afterEach(() => vi.useRealTimers());

  it("debounces draft changes and forwards active filters", async () => {
    const { result } = renderHook(
      () => {
        const [q, setQ] = useState("");
        return {
          suggestions: useTaskSuggestions({ q, status: "pending" }),
          setQ,
        };
      },
      { wrapper: createWrapper() },
    );

    act(() => result.current.setQ("ship"));
    await act(() => vi.advanceTimersByTimeAsync(249));
    expect(suggestionMocks.getTaskSuggestions).not.toHaveBeenCalled();

    await act(() => vi.advanceTimersByTimeAsync(1));
    expect(suggestionMocks.getTaskSuggestions).toHaveBeenCalledWith(
      { q: "ship", status: "pending", limit: 6 },
      expect.any(AbortSignal),
    );
  });

  it("does not request suggestions for a one-character draft", async () => {
    renderHook(() => useTaskSuggestions({ q: "s" }), {
      wrapper: createWrapper(),
    });

    await act(() => vi.advanceTimersByTimeAsync(250));
    expect(suggestionMocks.getTaskSuggestions).not.toHaveBeenCalled();
  });
});
