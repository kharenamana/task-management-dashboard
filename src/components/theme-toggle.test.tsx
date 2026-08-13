import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const themeMocks = vi.hoisted(() => ({ setTheme: vi.fn() }));

vi.mock("next-themes", () => ({
  useTheme: () => ({ theme: "system", setTheme: themeMocks.setTheme }),
}));

import { ThemeToggle } from "@/components/theme-toggle";

describe("ThemeToggle", () => {
  it("offers light, dark, and system themes through a keyboard-accessible menu", async () => {
    const user = userEvent.setup();
    render(<ThemeToggle />);

    const trigger = screen.getByRole("button", { name: "Choose color theme" });
    await user.tab();
    expect(trigger).toHaveFocus();
    await user.keyboard("{Enter}");
    expect(screen.getByRole("menuitem", { name: "Light" })).toBeVisible();
    expect(screen.getByRole("menuitem", { name: "System" })).toBeVisible();
    await user.keyboard("{ArrowDown}{Enter}");

    expect(themeMocks.setTheme).toHaveBeenCalledWith("dark");
  });
});
