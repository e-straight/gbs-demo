"use server";

import { redirect } from "next/navigation";
import {
  isHoneypotTripped,
  validateSubmission,
  type FieldName,
} from "./prompts";

export type FormState = {
  ok: boolean;
  fieldErrors?: Partial<Record<FieldName, string>>;
  formError?: string;
};

export const initialFormState: FormState = { ok: false };

// SECURITY NOTE: This demo has no users/auth, so this Server Action is
// intentionally public. Per the Next.js 16 docs, Server Actions are
// reachable via direct POST — never trust client-side validation alone.
// We still cap field sizes, allow-list enums, and require fields here.
// If/when we add persistence, wire this through auth and rate limiting.
export async function submitFriendForm(
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  // Honeypot: bots fill every field, humans never see this one. Silently
  // pretend it worked so the bot moves on without learning anything.
  if (isHoneypotTripped(formData)) {
    redirect("/friend-form/thanks");
  }

  const result = validateSubmission(formData);
  if (!result.ok) {
    return {
      ok: false,
      fieldErrors: result.fieldErrors,
      formError: "Please fix the highlighted fields.",
    };
  }

  // No persistence in this iteration — see plan.md "Out of scope".
  // A future change can hand result.data off to a storage layer here.

  redirect("/friend-form/thanks");
}
