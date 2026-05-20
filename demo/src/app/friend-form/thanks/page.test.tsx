import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import ThanksPage from "./page";

describe("ThanksPage", () => {
  it("renders a thank-you heading", () => {
    render(<ThanksPage />);
    expect(
      screen.getByRole("heading", { level: 1, name: /great friend/i }),
    ).toBeInTheDocument();
  });

  it("links back to the form and home", () => {
    render(<ThanksPage />);
    expect(
      screen.getByRole("link", { name: /fill out another/i }),
    ).toHaveAttribute("href", "/friend-form");
    expect(screen.getByRole("link", { name: /back home/i })).toHaveAttribute(
      "href",
      "/",
    );
  });
});
