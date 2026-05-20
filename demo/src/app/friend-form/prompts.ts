// Single source of truth for the friend-fill form: prompts, enum option lists,
// length caps, and a pure validator. Importable from server actions, client
// form components, and unit tests without any "use server"/"use client"
// boundary surprises.

export const HOW_KNOW_OPTIONS = [
  "college",
  "work",
  "hometown",
  "family",
  "partner-of-a-friend",
  "internet",
  "other",
] as const;

export type HowKnow = (typeof HOW_KNOW_OPTIONS)[number];

export const HOW_KNOW_LABELS: Record<HowKnow, string> = {
  college: "College / school",
  work: "Work",
  hometown: "Hometown",
  family: "Family",
  "partner-of-a-friend": "Partner of a friend",
  internet: "The internet",
  other: "Other",
};

export const LOVE_LANGUAGE_OPTIONS = [
  "words",
  "quality-time",
  "acts",
  "touch",
  "gifts",
] as const;

export type LoveLanguage = (typeof LOVE_LANGUAGE_OPTIONS)[number];

export const LOVE_LANGUAGE_LABELS: Record<LoveLanguage, string> = {
  words: "Words of affirmation",
  "quality-time": "Quality time",
  acts: "Acts of service",
  touch: "Physical touch",
  gifts: "Receiving gifts",
};

export const LIMITS = {
  shortText: 80,
  textarea: 600,
  email: 254,
} as const;

export const PROMPTS = {
  intro: "Help your friend find their person. Answer honestly — they'll see it.",
  friendName: {
    label: "Your name",
    hint: "So they know who hyped them up.",
    placeholder: "e.g. Alex",
  },
  theirName: {
    label: "Their first name",
    hint: "The friend you're filling this out for.",
    placeholder: "e.g. Sam",
  },
  howKnow: {
    label: "How do you know them?",
    hint: "Pick the one that fits best.",
  },
  threeWords: {
    label: "Three words that describe them",
    hint: "Vibes only.",
    placeholders: ["Word 1", "Word 2", "Word 3"] as const,
  },
  loveLanguage: {
    label: "What's their love language?",
    hint: "Your best guess is fine.",
  },
  idealSaturday: {
    label: "Their ideal Saturday",
    hint: "Paint a picture — morning to night.",
  },
  greenFlag: {
    label: "A green flag you've seen first-hand",
    hint: "Something a date should know they're getting.",
  },
  fictionalCharacter: {
    label: "Fictional character they're basically a clone of",
    hint: "Cite your source if it's niche.",
    placeholder: "e.g. Leslie Knope",
  },
  dateMustKnow: {
    label: "One thing a future date absolutely needs to know",
    hint: "The thing you always end up telling people about them.",
  },
  friendEmail: {
    label: "Your email (optional)",
    hint: "Only if you want us to ping you when they're ready to share.",
    placeholder: "you@example.com",
  },
} as const;

export type FieldName =
  | "friendName"
  | "theirName"
  | "howKnow"
  | "word1"
  | "word2"
  | "word3"
  | "loveLanguage"
  | "idealSaturday"
  | "greenFlag"
  | "fictionalCharacter"
  | "dateMustKnow"
  | "friendEmail";

export type ValidatedSubmission = {
  friendName: string;
  theirName: string;
  howKnow: HowKnow;
  words: [string, string, string];
  loveLanguage: LoveLanguage;
  idealSaturday: string;
  greenFlag: string;
  fictionalCharacter: string;
  dateMustKnow: string;
  friendEmail: string | null;
};

export type ValidationResult =
  | { ok: true; data: ValidatedSubmission }
  | { ok: false; fieldErrors: Partial<Record<FieldName, string>> };

// RFC 5322 is wild; this is the pragmatic HTML5-style check, which is what we
// also rely on at the browser layer.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function readString(formData: FormData, name: string): string {
  const raw = formData.get(name);
  return typeof raw === "string" ? raw.trim() : "";
}

function requireShortText(
  formData: FormData,
  name: FieldName,
  errors: Partial<Record<FieldName, string>>,
): string {
  const value = readString(formData, name);
  if (!value) {
    errors[name] = "Required.";
    return "";
  }
  if (value.length > LIMITS.shortText) {
    errors[name] = `Keep it under ${LIMITS.shortText} characters.`;
    return value;
  }
  return value;
}

function requireTextarea(
  formData: FormData,
  name: FieldName,
  errors: Partial<Record<FieldName, string>>,
): string {
  const value = readString(formData, name);
  if (!value) {
    errors[name] = "Required.";
    return "";
  }
  if (value.length > LIMITS.textarea) {
    errors[name] = `Keep it under ${LIMITS.textarea} characters.`;
    return value;
  }
  return value;
}

function optionalShortText(
  formData: FormData,
  name: FieldName,
  errors: Partial<Record<FieldName, string>>,
): string {
  const value = readString(formData, name);
  if (value && value.length > LIMITS.shortText) {
    errors[name] = `Keep it under ${LIMITS.shortText} characters.`;
  }
  return value;
}

export function validateSubmission(formData: FormData): ValidationResult {
  const errors: Partial<Record<FieldName, string>> = {};

  const friendName = requireShortText(formData, "friendName", errors);
  const theirName = requireShortText(formData, "theirName", errors);

  const howKnowRaw = readString(formData, "howKnow");
  let howKnow: HowKnow | "" = "";
  if (!howKnowRaw) {
    errors.howKnow = "Pick one.";
  } else if (!(HOW_KNOW_OPTIONS as readonly string[]).includes(howKnowRaw)) {
    errors.howKnow = "Pick one of the options.";
  } else {
    howKnow = howKnowRaw as HowKnow;
  }

  const word1 = requireShortText(formData, "word1", errors);
  const word2 = requireShortText(formData, "word2", errors);
  const word3 = requireShortText(formData, "word3", errors);

  const loveRaw = readString(formData, "loveLanguage");
  let loveLanguage: LoveLanguage | "" = "";
  if (!loveRaw) {
    errors.loveLanguage = "Pick one.";
  } else if (
    !(LOVE_LANGUAGE_OPTIONS as readonly string[]).includes(loveRaw)
  ) {
    errors.loveLanguage = "Pick one of the options.";
  } else {
    loveLanguage = loveRaw as LoveLanguage;
  }

  const idealSaturday = requireTextarea(formData, "idealSaturday", errors);
  const greenFlag = requireTextarea(formData, "greenFlag", errors);
  const fictionalCharacter = optionalShortText(
    formData,
    "fictionalCharacter",
    errors,
  );
  const dateMustKnow = requireTextarea(formData, "dateMustKnow", errors);

  const friendEmailRaw = readString(formData, "friendEmail");
  let friendEmail: string | null = null;
  if (friendEmailRaw) {
    if (friendEmailRaw.length > LIMITS.email) {
      errors.friendEmail = `Keep it under ${LIMITS.email} characters.`;
    } else if (!EMAIL_RE.test(friendEmailRaw)) {
      errors.friendEmail = "That doesn't look like an email.";
    } else {
      friendEmail = friendEmailRaw;
    }
  }

  if (Object.keys(errors).length > 0) {
    return { ok: false, fieldErrors: errors };
  }

  return {
    ok: true,
    data: {
      friendName,
      theirName,
      howKnow: howKnow as HowKnow,
      words: [word1, word2, word3],
      loveLanguage: loveLanguage as LoveLanguage,
      idealSaturday,
      greenFlag,
      fictionalCharacter,
      dateMustKnow,
      friendEmail,
    },
  };
}

export const HONEYPOT_FIELD = "website";

export function isHoneypotTripped(formData: FormData): boolean {
  const value = formData.get(HONEYPOT_FIELD);
  return typeof value === "string" && value.trim().length > 0;
}
