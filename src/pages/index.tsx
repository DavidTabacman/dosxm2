import Head from "next/head";
import Image from "next/image";
import AnimatedText from "@/components/AnimatedText";
import CTAButton from "@/components/CTAButton";
import styles from "@/styles/UnderConstruction.module.css";

export default function Home() {
  return (
    <>
      <Head>
        <title>DOSXM2 — Estamos preparando algo grande</title>
        <meta
          name="description"
          content="Menos propiedades, mas dedicacion. El doble de esfuerzo en la mitad del tiempo. Muy pronto."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta httpEquiv="content-language" content="es" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon-32x32.png" type="image/png" sizes="32x32" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </Head>
      <main className={styles.page}>
        <div className={styles.background} aria-hidden="true" />
        <section className={styles.card} aria-labelledby="headline">
          <Image
            src="/Nuevo Logo sin fondo.png"
            alt="DOSXM2 — Dos por metro cuadrado"
            width={360}
            height={180}
            className={styles.logo}
            priority
          />
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
            <CTAButton text="Instagram" href="https://www.instagram.com/dosxm2/" />
            <CTAButton text="TikTok" href="https://www.tiktok.com/@dosxm2" variant="outline" />
          </div>
        </section>
      </main>
    </>
  );
}
