import Head from "next/head";
import { Fraunces, Inter } from "next/font/google";
import V4Layout from "@/components/v4/V4Layout";
import V4StickyHeader from "@/components/v4/V4StickyHeader";
import V4HeroSplit from "@/components/v4/V4HeroSplit";
import V4Diferencial from "@/components/v4/V4Diferencial";
import V4Metrics from "@/components/v4/V4Metrics";
import V4Historias from "@/components/v4/V4Historias";
import V4Resenas from "@/components/v4/V4Resenas";
import V4Valorador from "@/components/v4/V4Valorador";
import V4Footer from "@/components/v4/V4Footer";
import V4WhatsAppFAB from "@/components/v4/V4WhatsAppFAB";
import { useScrollPastAnchor } from "@/components/shared/useScrollPastAnchor";

/* BRD 2.2 — "Ogg o Canela" are licensed faces. Fraunces is the closest
 * open substitute (Google Fonts) for a contrasted editorial serif. Swap
 * in a self-hosted Ogg/Canela once the client delivers the license.
 */
const fraunces = Fraunces({
  variable: "--font-v4-serif",
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  display: "swap",
});

/* Inter is the sans workhorse. Shares family with V3 but a unique CSS
 * variable name (--font-v4-sans) keeps the token scoped to V4. */
const inter = Inter({
  variable: "--font-v4-sans",
  subsets: ["latin"],
  display: "swap",
});

const FOUNDER_A = {
  name: "Borja",
  portraitUrl: "/v4/founders/founder_borja.webp",
  alt: "Retrato de Borja, cofundador de DOSXM2",
};
const FOUNDER_B = {
  name: "Pablo",
  portraitUrl: "/v4/founders/founder_pablo.webp",
  alt: "Retrato de Pablo, cofundador de DOSXM2",
};

/* BRD 4.3 — metrics: 30 días / 100% / 24/7.
 * "24/7" is non-numeric; handled via `staticValue`. */
const METRICS = [
  {
    value: 30,
    suffix: " días",
    label: "Tiempo promedio de venta",
    caption: "Medido sobre propiedades vendidas en Madrid en los últimos 12 meses.",
  },
  {
    value: 100,
    suffix: "%",
    label: "Tasa de éxito",
    caption: "Cuando aceptamos un encargo, la vendemos.",
  },
  {
    value: null,
    staticValue: "24/7",
    label: "Disponibilidad",
    caption: "Dos personas, un teléfono. Te respondemos cuando lo necesites.",
  },
] as const;

const BORJA_PHONE = "34667006662";
const PABLO_PHONE = "34674527410";
const FOUNDERS = [
  { name: "Borja", phone: BORJA_PHONE },
  { name: "Pablo", phone: PABLO_PHONE },
] as const;
const WA_MESSAGE =
  "Hola DOSXM2, quiero información sobre cómo vender mi casa en Madrid.";

const VALORADOR_FOUNDERS = {
  a: {
    name: FOUNDER_A.name,
    phone: BORJA_PHONE,
    portraitUrl: FOUNDER_A.portraitUrl,
    portraitAlt: FOUNDER_A.alt,
  },
  b: {
    name: FOUNDER_B.name,
    phone: PABLO_PHONE,
    portraitUrl: FOUNDER_B.portraitUrl,
    portraitAlt: FOUNDER_B.alt,
  },
  message: WA_MESSAGE,
};

export default function V4Page() {
  /* Single source of truth for the "portraits have detached" handoff.
   * Both V4Diferencial (to fade its portraits out) and V4WhatsAppFAB
   * (to rise into view) read this boolean, so their transitions stay
   * coordinated without duplicate observers. */
  const portraitsDetached = useScrollPastAnchor("#diferencial");

  return (
    <>
      <Head>
        <title>DOSXM2 — Vendemos tu casa como si fuese la nuestra</title>
        <meta
          name="description"
          content="DOSXM2: dos expertos que venden tu casa en Madrid con trato personal, doble compromiso y resultados demostrables."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta httpEquiv="content-language" content="es" />
        <meta property="og:title" content="DOSXM2 — Elegancia cinematográfica con empatía conversacional" />
        <meta
          property="og:description"
          content="Detrás de cada casa hay una historia. Vendemos la tuya como si fuese la nuestra."
        />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="es_ES" />
      </Head>
      <V4Layout fontClassName={`${fraunces.variable} ${inter.variable}`}>
        <V4StickyHeader />
        <V4HeroSplit />
        <V4Diferencial
          founderA={FOUNDER_A}
          founderB={FOUNDER_B}
          portraitsDetached={portraitsDetached}
        />
        <V4Metrics metrics={METRICS} />
        <V4Historias />
        <V4Resenas />
        <V4Valorador founders={VALORADOR_FOUNDERS} />
        <V4Footer founders={FOUNDERS} />
        <V4WhatsAppFAB
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
      </V4Layout>
    </>
  );
}
