import Head from "next/head";
import AnimatedText from "@/components/AnimatedText";
import styles from "@/styles/UnderConstruction.module.css";

export default function Home() {
  return (
    <>
      <Head>
        <title>Estamos preparando algo grande</title>
        <meta
          name="description"
          content="Estamos creando algo especial. Muy pronto."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta httpEquiv="content-language" content="es" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.page}>
        <div className={styles.background} aria-hidden="true" />
        <section className={styles.card} aria-labelledby="headline">
          <AnimatedText
            id="headline"
            text="Estamos preparando algo grande"
            tag="h1"
            className={styles.headline}
            delayMs={300}
            staggerMs={40}
          />
          <p className={styles.subtext}>
            Estamos creando algo especial. Muy pronto.
          </p>
        </section>
      </main>
    </>
  );
}
