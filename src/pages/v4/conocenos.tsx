/* TODO (V4-becomes-/): when /v4 becomes the live root route, move
 * this file to src/pages/conocenos.tsx and update:
 *   - canonical link below
 *   - <link rel="preload"> href
 *   - V4StickyHeader's V4_NAV_LINKS entry for "Conócenos" (kind: "page" href)
 *   - V4Diferencial.tsx signatureLink href
 *   - V4ConocenosJuntos CTA prop default
 */
import Head from "next/head";
import { Fraunces, Inter } from "next/font/google";
import V4Layout from "@/components/v4/V4Layout";
import V4StickyHeader from "@/components/v4/V4StickyHeader";
import V4Conocenos from "@/components/v4/V4Conocenos";
import V4Footer from "@/components/v4/V4Footer";
import { FOUNDERS, FOUNDER_PABLO } from "@/constants/founders";

const fraunces = Fraunces({
  variable: "--font-v4-serif",
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-v4-sans",
  subsets: ["latin"],
  display: "swap",
});

export default function V4ConocenosPage() {
  return (
    <>
      <Head>
        <title>Conócenos — DOSXM2</title>
        <meta
          name="description"
          content="Pablo y Borja, los dos fundadores de DOSXM2. Desde Banfield y Getafe, una década en multinacionales y un único objetivo: vender tu casa en Madrid como si fuese la nuestra."
        />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, viewport-fit=cover"
        />
        <meta httpEquiv="content-language" content="es" />
        <link rel="canonical" href="/v4/conocenos" />
        <meta property="og:title" content="Conócenos — DOSXM2" />
        <meta
          property="og:description"
          content="Pablo y Borja, los dos fundadores de DOSXM2 — la historia detrás del equipo que vende tu casa en Madrid."
        />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="es_ES" />
        <meta property="og:image" content="/v4/founders/together.webp" />
        <link
          rel="preload"
          as="image"
          href={FOUNDER_PABLO.portraitUrl}
          type="image/webp"
          fetchPriority="high"
        />
      </Head>
      <V4Layout fontClassName={`${fraunces.variable} ${inter.variable}`}>
        <V4StickyHeader alwaysSolid />
        <V4Conocenos />
        <V4Footer founders={FOUNDERS} />
      </V4Layout>
    </>
  );
}
