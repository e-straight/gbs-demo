import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.main}>
      <section className={styles.hero}>
        <h1 className={styles.title}>GBS Demo</h1>
        <p className={styles.subtitle}>
          A starting point. Build the feature here.
        </p>
      </section>
    </main>
  );
}
