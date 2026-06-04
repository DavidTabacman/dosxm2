import Head from "next/head";
import { Fraunces, Inter } from "next/font/google";
import V5Layout from "@/components/v5/V5Layout";
import V5StickyHeader from "@/components/v5/V5StickyHeader";
import V5HeroSplit from "@/components/v5/V5HeroSplit";
import V5Diferencial from "@/components/v5/V5Diferencial";
import V5Metrics from "@/components/v5/V5Metrics";
import V5Historias from "@/components/v5/V5Historias";
import V5Resenas from "@/components/v5/V5Resenas";
import V5Contacto from "@/components/v5/V5Contacto";
import V5Footer from "@/components/v5/V5Footer";
import V5WhatsAppFAB from "@/components/v5/V5WhatsAppFAB";
import { useScrollPastAnchor } from "@/components/shared/useScrollPastAnchor";
import {
  FOUNDER_BORJA as FOUNDER_A,
  FOUNDER_PABLO as FOUNDER_B,
  FOUNDERS,
  BORJA_PHONE,
  PABLO_PHONE,
  WA_MESSAGE,
  CONTACTO_FOUNDERS,
} from "@/constants/founders";

/* BRD 2.2 — "Ogg o Canela" are licensed faces. Fraunces is the closest
 * open substitute (Google Fonts) for a contrasted editorial serif. Swap
 * in a self-hosted Ogg/Canela once the client delivers the license.
 */
const fraunces = Fraunces({
  variable: "--font-v5-serif",
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  display: "swap",
});

/* Inter is the sans workhorse. Shares family with V3 but a unique CSS
 * variable name (--font-v5-sans) keeps the token scoped to V5. */
const inter = Inter({
  variable: "--font-v5-sans",
  subsets: ["latin"],
  display: "swap",
});

/* Métricas: 34 días / 98% / 9/10.
 * En 9/10 el "/" va vía `divider` (Papel Cálido) para que sólo el "10"
 * herede el acento Ocre Terroso vía `staticValueAccent`. */
const METRICS = [
  {
    value: 34,
    suffix: " días",
    label: "Tiempo de venta promedio",
    caption: "Medido sobre propiedades vendidas en Madrid en los últimos 12 meses.",
  },
  {
    value: 98,
    suffix: "%",
    label: "Precisión en el precio",
    caption: "Nuestras viviendas se venden, de media, por el 98,37% del precio de valoración que recomendamos.",
  },
  {
    value: 9,
    divider: "/",
    staticValueAccent: "10",
    label: "Clientes nos recomiendan",
    caption: "De quienes han firmado con nosotros en los últimos 12 meses.",
  },
] as const;

export default function V5Page() {
  /* Single source of truth for the "portraits have detached" handoff.
   * Both V5Diferencial (to fade its portraits out) and V5WhatsAppFAB
   * (to rise into view) read this boolean, so their transitions stay
   * coordinated without duplicate observers. */
  const portraitsDetached = useScrollPastAnchor("#diferencial");

  return (
    <>
      <Head>
        <title>DOSXM2 — Inmobiliaria en Madrid que vende tu casa como si fuese la nuestra</title>
        <meta
          name="description"
          content="DOSXM2: dos expertos que venden tu casa en Madrid con trato personal, doble compromiso y resultados demostrables."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta httpEquiv="content-language" content="es" />
        <meta property="og:title" content="DOSXM2 — Inmobiliaria en Madrid · Elegancia cinematográfica con empatía conversacional" />
        <meta
          property="og:description"
          content="Detrás de cada casa hay una historia. Vendemos la tuya como si fuese la nuestra."
        />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="es_ES" />
      </Head>
      <V5Layout fontClassName={`${fraunces.variable} ${inter.variable}`}>
        <V5StickyHeader />
        <V5HeroSplit />
        <V5Diferencial
          founderA={FOUNDER_A}
          founderB={FOUNDER_B}
          portraitsDetached={portraitsDetached}
        />
        <V5Metrics metrics={METRICS} />
        <V5Historias />
        <V5Resenas />
        <V5Contacto founders={CONTACTO_FOUNDERS} />
        <V5Footer founders={FOUNDERS} />
        <V5WhatsAppFAB
          founderAPhone={BORJA_PHONE}
          founderBPhone={PABLO_PHONE}
          message={WA_MESSAGE}
          visible={portraitsDetached}
          portraitAUrl={FOUNDER_A.portraitUrl}
          portraitAAlt={FOUNDER_A.alt}
          portraitBUrl={FOUNDER_B.portraitUrl}
          portraitBAlt={FOUNDER_B.alt}
          founderAName={FOUNDER_A.name}
          founderBName={FOUNDER_B.name}
        />
      </V5Layout>
    </>
  );
}
