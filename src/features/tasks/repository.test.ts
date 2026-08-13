const repositoryMocks = vi.hoisted(() => ({
  from: vi.fn(),
  select: vi.fn(),
  eq: vi.fn(),
  ilike: vi.fn(),
  order: vi.fn(),
  limit: vi.fn(),
}));

vi.mock("server-only", () => ({}));

import { listTaskTitleRows } from "@/features/tasks/repository";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database.generated";

describe("task repository suggestions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    repositoryMocks.from.mockReturnValue(repositoryMocks);
    repositoryMocks.select.mockReturnValue(repositoryMocks);
    repositoryMocks.eq.mockReturnValue(repositoryMocks);
    repositoryMocks.ilike.mockReturnValue(repositoryMocks);
    repositoryMocks.order.mockReturnValue(repositoryMocks);
    repositoryMocks.limit.mockResolvedValue({
      data: [{ title: "Ship dashboard" }],
      error: null,
    });
  });

  it("applies the authenticated owner and active filters before limiting", async () => {
    const client = {
      from: repositoryMocks.from,
    } as unknown as SupabaseClient<Database>;

    await expect(
      listTaskTitleRows(client, "owner-a", {
        q: "ship%_",
        status: "pending",
        priority: "high",
        limit: 6,
      }),
    ).resolves.toEqual([{ title: "Ship dashboard" }]);

    expect(repositoryMocks.from).toHaveBeenCalledWith("tasks");
    expect(repositoryMocks.select).toHaveBeenCalledWith("title");
    expect(repositoryMocks.eq).toHaveBeenCalledWith("user_id", "owner-a");
    expect(repositoryMocks.eq).toHaveBeenCalledWith("status", "pending");
    expect(repositoryMocks.eq).toHaveBeenCalledWith("priority", "high");
    expect(repositoryMocks.ilike).toHaveBeenCalledWith("title", "%ship\\%\\_%");
    expect(repositoryMocks.limit).toHaveBeenCalledWith(18);
  });
});
