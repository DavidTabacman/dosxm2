import Head from "next/head";
import AnimatedText from "@/components/AnimatedText";
import CTAButton from "@/components/CTAButton";
import styles from "@/styles/UnderConstruction.module.css";

export default function Home() {
  return (
    <>
      <Head>
        <title>DOS XM2 — Estamos preparando algo grande</title>
        <meta
          name="description"
          content="Menos propiedades, mas dedicacion. El doble de esfuerzo en la mitad del tiempo. Muy pronto."
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
            Menos propiedades, mas dedicacion. El doble de esfuerzo en la mitad
            del tiempo. Muy pronto.
          </p>
          <div className={styles.ctaWrapper}>
            <CTAButton text="Hablamos?" href="mailto:info@dosxm2.com" />
          </div>
        </section>
      </main>
    </>
  );
}
