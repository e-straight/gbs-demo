import { afterEach, describe, expect, it, vi } from "vitest";

const { redirectMock } = vi.hoisted(() => ({
  redirectMock: vi.fn((url: string): never => {
    throw new Error(`NEXT_REDIRECT:${url}`);
  }),
}));

vi.mock("next/navigation", () => ({
  redirect: redirectMock,
}));

import { initialFormState, submitFriendForm } from "./actions";

function makeValidFormData(
  overrides: Record<string, string> = {},
): FormData {
  const defaults: Record<string, string> = {
    friendName: "Alex",
    theirName: "Sam",
    howKnow: "college",
    word1: "kind",
    word2: "funny",
    word3: "curious",
    loveLanguage: "words",
    idealSaturday: "Farmers market, then a long bike ride.",
    greenFlag: "Texts back even when busy.",
    fictionalCharacter: "Leslie Knope",
    dateMustKnow: "They will order dessert. Always.",
    friendEmail: "",
  };
  const fd = new FormData();
  for (const [k, v] of Object.entries({ ...defaults, ...overrides })) {
    fd.set(k, v);
  }
  return fd;
}

afterEach(() => {
  redirectMock.mockClear();
});

describe("submitFriendForm", () => {
  it("redirects to /friend-form/thanks on a valid submission", async () => {
    await expect(
      submitFriendForm(initialFormState, makeValidFormData()),
    ).rejects.toThrow("NEXT_REDIRECT:/friend-form/thanks");
    expect(redirectMock).toHaveBeenCalledWith("/friend-form/thanks");
  });

  it("returns field errors and does NOT redirect on invalid input", async () => {
    const result = await submitFriendForm(
      initialFormState,
      makeValidFormData({ friendName: "", howKnow: "bogus" }),
    );
    expect(redirectMock).not.toHaveBeenCalled();
    expect(result.ok).toBe(false);
    expect(result.fieldErrors?.friendName).toBeTruthy();
    expect(result.fieldErrors?.howKnow).toBeTruthy();
    expect(result.formError).toBeTruthy();
  });

  it("silently redirects when the honeypot is tripped (no processing)", async () => {
    // Honeypot is checked BEFORE validation, so even an otherwise-invalid
    // submission should redirect without leaking field errors.
    await expect(
      submitFriendForm(
        initialFormState,
        makeValidFormData({
          website: "https://spam.example",
          friendName: "",
        }),
      ),
    ).rejects.toThrow("NEXT_REDIRECT:/friend-form/thanks");
    expect(redirectMock).toHaveBeenCalledWith("/friend-form/thanks");
  });
});
