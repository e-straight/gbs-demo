import { describe, expect, it } from "vitest";
import {
  HOW_KNOW_OPTIONS,
  LIMITS,
  LOVE_LANGUAGE_OPTIONS,
  isHoneypotTripped,
  validateSubmission,
} from "./prompts";

function makeFormData(
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

describe("validateSubmission", () => {
  it("accepts a valid submission", () => {
    const result = validateSubmission(makeFormData());
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.friendName).toBe("Alex");
      expect(result.data.words).toEqual(["kind", "funny", "curious"]);
      expect(result.data.friendEmail).toBeNull();
    }
  });

  it("trims whitespace from inputs", () => {
    const result = validateSubmission(
      makeFormData({ friendName: "  Alex  ", theirName: "\tSam\n" }),
    );
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.friendName).toBe("Alex");
      expect(result.data.theirName).toBe("Sam");
    }
  });

  it("rejects when required fields are missing", () => {
    const fd = makeFormData({
      friendName: "",
      theirName: "",
      word1: "",
      idealSaturday: "",
    });
    const result = validateSubmission(fd);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.fieldErrors.friendName).toBeTruthy();
      expect(result.fieldErrors.theirName).toBeTruthy();
      expect(result.fieldErrors.word1).toBeTruthy();
      expect(result.fieldErrors.idealSaturday).toBeTruthy();
    }
  });

  it("rejects when only whitespace is provided for required fields", () => {
    const result = validateSubmission(
      makeFormData({ friendName: "   ", greenFlag: "\n\t" }),
    );
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.fieldErrors.friendName).toBeTruthy();
      expect(result.fieldErrors.greenFlag).toBeTruthy();
    }
  });

  it("caps short text fields at the configured limit", () => {
    const tooLong = "a".repeat(LIMITS.shortText + 1);
    const result = validateSubmission(makeFormData({ friendName: tooLong }));
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.fieldErrors.friendName).toMatch(/under/);
    }
  });

  it("caps textareas at the configured limit", () => {
    const tooLong = "x".repeat(LIMITS.textarea + 1);
    const result = validateSubmission(makeFormData({ idealSaturday: tooLong }));
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.fieldErrors.idealSaturday).toMatch(/under/);
    }
  });

  it("rejects howKnow values that are not in the allow-list", () => {
    const result = validateSubmission(
      makeFormData({ howKnow: "<script>" }),
    );
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.fieldErrors.howKnow).toBeTruthy();
    }
  });

  it("rejects loveLanguage values that are not in the allow-list", () => {
    const result = validateSubmission(makeFormData({ loveLanguage: "bogus" }));
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.fieldErrors.loveLanguage).toBeTruthy();
    }
  });

  it("accepts every howKnow option in the allow-list", () => {
    for (const opt of HOW_KNOW_OPTIONS) {
      const result = validateSubmission(makeFormData({ howKnow: opt }));
      expect(result.ok).toBe(true);
    }
  });

  it("accepts every loveLanguage option in the allow-list", () => {
    for (const opt of LOVE_LANGUAGE_OPTIONS) {
      const result = validateSubmission(makeFormData({ loveLanguage: opt }));
      expect(result.ok).toBe(true);
    }
  });

  it("treats fictionalCharacter as optional", () => {
    const result = validateSubmission(
      makeFormData({ fictionalCharacter: "" }),
    );
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.fictionalCharacter).toBe("");
    }
  });

  it("accepts a valid friendEmail", () => {
    const result = validateSubmission(
      makeFormData({ friendEmail: "alex@example.com" }),
    );
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.friendEmail).toBe("alex@example.com");
    }
  });

  it("rejects an invalid friendEmail", () => {
    const result = validateSubmission(
      makeFormData({ friendEmail: "not-an-email" }),
    );
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.fieldErrors.friendEmail).toBeTruthy();
    }
  });

  it("rejects overlong emails", () => {
    const huge = "a".repeat(LIMITS.email) + "@x.co";
    const result = validateSubmission(makeFormData({ friendEmail: huge }));
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.fieldErrors.friendEmail).toBeTruthy();
    }
  });
});

describe("isHoneypotTripped", () => {
  it("returns false when honeypot is empty", () => {
    expect(isHoneypotTripped(makeFormData())).toBe(false);
  });

  it("returns true when a bot fills the honeypot", () => {
    expect(isHoneypotTripped(makeFormData({ website: "https://spam.example" }))).toBe(
      true,
    );
  });

  it("ignores whitespace-only values", () => {
    expect(isHoneypotTripped(makeFormData({ website: "   " }))).toBe(false);
  });
});
