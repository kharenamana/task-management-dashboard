import { render, screen } from "@testing-library/react";

import {
  MarketingFooter,
  MarketingHeader,
} from "@/features/marketing/components/marketing-shell";

describe("marketing shell", () => {
  it("provides crawlable primary, mobile, and footer navigation", () => {
    render(
      <>
        <MarketingHeader />
        <MarketingFooter />
      </>,
    );
    expect(
      screen.getByRole("navigation", { name: "Primary navigation" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("navigation", { name: "Mobile navigation" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("navigation", { name: "Footer navigation" }),
    ).toBeInTheDocument();
    expect(
      screen.getAllByRole("link", { name: "Architecture" }),
    ).not.toHaveLength(0);
  });
});
