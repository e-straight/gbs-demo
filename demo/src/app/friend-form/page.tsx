import type { Metadata } from "next";
import { FriendForm } from "./form";
import styles from "./friend-form.module.css";

export const metadata: Metadata = {
  title: "Hype your friend · GBS Demo",
  description:
    "Answer a few prompts about your friend so their next match knows who they're getting.",
  robots: { index: false, follow: false },
};

export default function FriendFormPage() {
  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Hype your friend</h1>
        <p className={styles.subtitle}>
          A few quick prompts. Honest answers only — they&apos;ll see this.
        </p>
      </header>
      <FriendForm />
    </main>
  );
}
