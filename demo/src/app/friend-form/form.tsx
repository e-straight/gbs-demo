"use client";

import { useActionState, useId } from "react";
import { initialFormState, submitFriendForm } from "./actions";
import {
  HONEYPOT_FIELD,
  HOW_KNOW_LABELS,
  HOW_KNOW_OPTIONS,
  LIMITS,
  LOVE_LANGUAGE_LABELS,
  LOVE_LANGUAGE_OPTIONS,
  PROMPTS,
  type FieldName,
} from "./prompts";
import styles from "./friend-form.module.css";

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className={styles.error} role="alert">
      {message}
    </p>
  );
}

function errorIdFor(baseId: string, field: FieldName) {
  return `${baseId}-${field}-error`;
}

export function FriendForm() {
  const [state, formAction, pending] = useActionState(
    submitFriendForm,
    initialFormState,
  );
  const baseId = useId();
  const fieldErrors = state.fieldErrors ?? {};

  const describedBy = (field: FieldName) =>
    fieldErrors[field] ? errorIdFor(baseId, field) : undefined;
  const invalid = (field: FieldName) => Boolean(fieldErrors[field]);

  return (
    <form action={formAction} className={styles.form} noValidate>
      <p className={styles.intro}>{PROMPTS.intro}</p>

      {/* Honeypot: hidden from humans, irresistible to bots. */}
      <div className={styles.honeypot} aria-hidden="true">
        <label>
          Leave this empty
          <input
            type="text"
            name={HONEYPOT_FIELD}
            tabIndex={-1}
            autoComplete="off"
          />
        </label>
      </div>

      <div className={styles.field}>
        <label htmlFor={`${baseId}-friendName`}>
          {PROMPTS.friendName.label}
        </label>
        <span className={styles.hint}>{PROMPTS.friendName.hint}</span>
        <input
          id={`${baseId}-friendName`}
          name="friendName"
          type="text"
          required
          maxLength={LIMITS.shortText}
          placeholder={PROMPTS.friendName.placeholder}
          aria-invalid={invalid("friendName") || undefined}
          aria-describedby={describedBy("friendName")}
        />
        <FieldError
          id={errorIdFor(baseId, "friendName")}
          message={fieldErrors.friendName}
        />
      </div>

      <div className={styles.field}>
        <label htmlFor={`${baseId}-theirName`}>
          {PROMPTS.theirName.label}
        </label>
        <span className={styles.hint}>{PROMPTS.theirName.hint}</span>
        <input
          id={`${baseId}-theirName`}
          name="theirName"
          type="text"
          required
          maxLength={LIMITS.shortText}
          placeholder={PROMPTS.theirName.placeholder}
          aria-invalid={invalid("theirName") || undefined}
          aria-describedby={describedBy("theirName")}
        />
        <FieldError
          id={errorIdFor(baseId, "theirName")}
          message={fieldErrors.theirName}
        />
      </div>

      <div className={styles.field}>
        <label htmlFor={`${baseId}-howKnow`}>{PROMPTS.howKnow.label}</label>
        <span className={styles.hint}>{PROMPTS.howKnow.hint}</span>
        <select
          id={`${baseId}-howKnow`}
          name="howKnow"
          required
          defaultValue=""
          aria-invalid={invalid("howKnow") || undefined}
          aria-describedby={describedBy("howKnow")}
        >
          <option value="" disabled>
            Pick one…
          </option>
          {HOW_KNOW_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>
              {HOW_KNOW_LABELS[opt]}
            </option>
          ))}
        </select>
        <FieldError
          id={errorIdFor(baseId, "howKnow")}
          message={fieldErrors.howKnow}
        />
      </div>

      <fieldset className={styles.field}>
        <legend>{PROMPTS.threeWords.label}</legend>
        <span className={styles.hint}>{PROMPTS.threeWords.hint}</span>
        <div className={styles.threeWords}>
          {(["word1", "word2", "word3"] as const).map((name, i) => (
            <div key={name} className={styles.threeWordsItem}>
              <label
                htmlFor={`${baseId}-${name}`}
                className={styles.visuallyHidden}
              >
                {PROMPTS.threeWords.placeholders[i]}
              </label>
              <input
                id={`${baseId}-${name}`}
                name={name}
                type="text"
                required
                maxLength={LIMITS.shortText}
                placeholder={PROMPTS.threeWords.placeholders[i]}
                aria-invalid={invalid(name) || undefined}
                aria-describedby={describedBy(name)}
              />
              <FieldError
                id={errorIdFor(baseId, name)}
                message={fieldErrors[name]}
              />
            </div>
          ))}
        </div>
      </fieldset>

      <fieldset className={styles.field}>
        <legend>{PROMPTS.loveLanguage.label}</legend>
        <span className={styles.hint}>{PROMPTS.loveLanguage.hint}</span>
        <div
          className={styles.radioGroup}
          role="radiogroup"
          aria-invalid={invalid("loveLanguage") || undefined}
          aria-describedby={describedBy("loveLanguage")}
        >
          {LOVE_LANGUAGE_OPTIONS.map((opt) => (
            <label key={opt} className={styles.radio}>
              <input type="radio" name="loveLanguage" value={opt} required />
              <span>{LOVE_LANGUAGE_LABELS[opt]}</span>
            </label>
          ))}
        </div>
        <FieldError
          id={errorIdFor(baseId, "loveLanguage")}
          message={fieldErrors.loveLanguage}
        />
      </fieldset>

      <div className={styles.field}>
        <label htmlFor={`${baseId}-idealSaturday`}>
          {PROMPTS.idealSaturday.label}
        </label>
        <span className={styles.hint}>{PROMPTS.idealSaturday.hint}</span>
        <textarea
          id={`${baseId}-idealSaturday`}
          name="idealSaturday"
          required
          rows={3}
          maxLength={LIMITS.textarea}
          aria-invalid={invalid("idealSaturday") || undefined}
          aria-describedby={describedBy("idealSaturday")}
        />
        <FieldError
          id={errorIdFor(baseId, "idealSaturday")}
          message={fieldErrors.idealSaturday}
        />
      </div>

      <div className={styles.field}>
        <label htmlFor={`${baseId}-greenFlag`}>
          {PROMPTS.greenFlag.label}
        </label>
        <span className={styles.hint}>{PROMPTS.greenFlag.hint}</span>
        <textarea
          id={`${baseId}-greenFlag`}
          name="greenFlag"
          required
          rows={3}
          maxLength={LIMITS.textarea}
          aria-invalid={invalid("greenFlag") || undefined}
          aria-describedby={describedBy("greenFlag")}
        />
        <FieldError
          id={errorIdFor(baseId, "greenFlag")}
          message={fieldErrors.greenFlag}
        />
      </div>

      <div className={styles.field}>
        <label htmlFor={`${baseId}-fictionalCharacter`}>
          {PROMPTS.fictionalCharacter.label}
        </label>
        <span className={styles.hint}>{PROMPTS.fictionalCharacter.hint}</span>
        <input
          id={`${baseId}-fictionalCharacter`}
          name="fictionalCharacter"
          type="text"
          maxLength={LIMITS.shortText}
          placeholder={PROMPTS.fictionalCharacter.placeholder}
          aria-invalid={invalid("fictionalCharacter") || undefined}
          aria-describedby={describedBy("fictionalCharacter")}
        />
        <FieldError
          id={errorIdFor(baseId, "fictionalCharacter")}
          message={fieldErrors.fictionalCharacter}
        />
      </div>

      <div className={styles.field}>
        <label htmlFor={`${baseId}-dateMustKnow`}>
          {PROMPTS.dateMustKnow.label}
        </label>
        <span className={styles.hint}>{PROMPTS.dateMustKnow.hint}</span>
        <textarea
          id={`${baseId}-dateMustKnow`}
          name="dateMustKnow"
          required
          rows={3}
          maxLength={LIMITS.textarea}
          aria-invalid={invalid("dateMustKnow") || undefined}
          aria-describedby={describedBy("dateMustKnow")}
        />
        <FieldError
          id={errorIdFor(baseId, "dateMustKnow")}
          message={fieldErrors.dateMustKnow}
        />
      </div>

      <div className={styles.field}>
        <label htmlFor={`${baseId}-friendEmail`}>
          {PROMPTS.friendEmail.label}
        </label>
        <span className={styles.hint}>{PROMPTS.friendEmail.hint}</span>
        <input
          id={`${baseId}-friendEmail`}
          name="friendEmail"
          type="email"
          maxLength={LIMITS.email}
          autoComplete="email"
          placeholder={PROMPTS.friendEmail.placeholder}
          aria-invalid={invalid("friendEmail") || undefined}
          aria-describedby={describedBy("friendEmail")}
        />
        <FieldError
          id={errorIdFor(baseId, "friendEmail")}
          message={fieldErrors.friendEmail}
        />
      </div>

      <p className={styles.formError} aria-live="polite" role="status">
        {state.formError ?? ""}
      </p>

      <button type="submit" className={styles.submit} disabled={pending}>
        {pending ? "Sending…" : "Send their hype"}
      </button>
    </form>
  );
}
