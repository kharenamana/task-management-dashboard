import { render, screen } from "@testing-library/react";

import HomePage from "./page";

describe("HomePage", () => {
  it("presents the product and primary calls to action", () => {
    render(<HomePage />);
    expect(
      screen.getByRole("heading", { name: /make progress visible/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /create your workspace/i }),
    ).toHaveAttribute("href", "/signup");
    expect(
      screen.getByRole("navigation", { name: /primary navigation/i }),
    ).toBeInTheDocument();
  });
});
