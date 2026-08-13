import { render, screen } from "@testing-library/react";

import HomePage from "./page";

describe("HomePage", () => {
  it("presents the product, case study, and primary actions", () => {
    render(<HomePage />);
    expect(
      screen.getByRole("heading", {
        name: /task dashboard engineered beyond the happy path/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /open the working product/i }),
    ).toHaveAttribute("href", "/signup");
    expect(
      screen.getByRole("link", { name: /explore the architecture/i }),
    ).toHaveAttribute("href", "/architecture");
    expect(screen.getByRole("figure")).toHaveAccessibleName(
      /representative preview/i,
    );
  });
});
