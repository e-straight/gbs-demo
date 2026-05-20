import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import FriendFormPage from "./page";
import {
  HOW_KNOW_LABELS,
  HOW_KNOW_OPTIONS,
  LOVE_LANGUAGE_LABELS,
  LOVE_LANGUAGE_OPTIONS,
  PROMPTS,
} from "./prompts";

describe("FriendFormPage", () => {
  it("renders the page heading", () => {
    render(<FriendFormPage />);
    expect(
      screen.getByRole("heading", { level: 1, name: /hype your friend/i }),
    ).toBeInTheDocument();
  });

  it("renders every prompt label", () => {
    render(<FriendFormPage />);
    expect(screen.getByLabelText(PROMPTS.friendName.label)).toBeInTheDocument();
    expect(screen.getByLabelText(PROMPTS.theirName.label)).toBeInTheDocument();
    expect(screen.getByLabelText(PROMPTS.howKnow.label)).toBeInTheDocument();
    expect(
      screen.getByLabelText(PROMPTS.idealSaturday.label),
    ).toBeInTheDocument();
    expect(screen.getByLabelText(PROMPTS.greenFlag.label)).toBeInTheDocument();
    expect(
      screen.getByLabelText(PROMPTS.fictionalCharacter.label),
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText(PROMPTS.dateMustKnow.label),
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText(PROMPTS.friendEmail.label),
    ).toBeInTheDocument();
    // Fieldset legends:
    expect(
      screen.getByText(PROMPTS.threeWords.label, { selector: "legend" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(PROMPTS.loveLanguage.label, { selector: "legend" }),
    ).toBeInTheDocument();
  });

  it("renders every howKnow option in the dropdown", () => {
    render(<FriendFormPage />);
    const select = screen.getByLabelText(
      PROMPTS.howKnow.label,
    ) as HTMLSelectElement;
    for (const opt of HOW_KNOW_OPTIONS) {
      const option = Array.from(select.options).find(
        (o) => o.value === opt,
      );
      expect(option?.textContent).toBe(HOW_KNOW_LABELS[opt]);
    }
  });

  it("renders every love-language option as a radio", () => {
    render(<FriendFormPage />);
    for (const opt of LOVE_LANGUAGE_OPTIONS) {
      expect(
        screen.getByRole("radio", { name: LOVE_LANGUAGE_LABELS[opt] }),
      ).toBeInTheDocument();
    }
  });

  it("renders three word inputs", () => {
    render(<FriendFormPage />);
    expect(screen.getByLabelText("Word 1")).toBeInTheDocument();
    expect(screen.getByLabelText("Word 2")).toBeInTheDocument();
    expect(screen.getByLabelText("Word 3")).toBeInTheDocument();
  });

  it("renders a submit button", () => {
    render(<FriendFormPage />);
    expect(
      screen.getByRole("button", { name: /send their hype/i }),
    ).toBeInTheDocument();
  });

  it("includes a hidden honeypot input", () => {
    const { container } = render(<FriendFormPage />);
    const honeypot = container.querySelector(
      'input[name="website"]',
    ) as HTMLInputElement | null;
    expect(honeypot).not.toBeNull();
    expect(honeypot?.tabIndex).toBe(-1);
  });
});
