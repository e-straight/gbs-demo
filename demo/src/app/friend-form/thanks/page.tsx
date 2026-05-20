import type { Metadata } from "next";
import Link from "next/link";
import styles from "../friend-form.module.css";

export const metadata: Metadata = {
  title: "Thanks · GBS Demo",
  description: "Thanks for hyping your friend.",
  robots: { index: false, follow: false },
};

export default function ThanksPage() {
  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>You&apos;re a great friend.</h1>
        <p className={styles.subtitle}>
          Thanks for the hype. We&apos;ll let them know someone vouched.
        </p>
      </header>
      <div className={styles.thanksActions}>
        <Link href="/friend-form" className={styles.secondaryLink}>
          Fill out another
        </Link>
        <Link href="/" className={styles.secondaryLink}>
          Back home
        </Link>
      </div>
    </main>
  );
}
