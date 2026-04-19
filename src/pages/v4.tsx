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

/* BRD 2.2 — "Ogg o Canela" are licensed faces. Fraunces is the closest
 * open substitute (Google Fonts) for a contrasted editorial serif. Swap
 * in a self-hosted Ogg/Canela once the client delivers the license.
 */
const fraunces = Fraunces({
  variable: "--font-v4-serif",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
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

/* Portraits pulled from frames of the founders' own tours on @dosxm2
 * (TikTok). Only Borja is referenced by name in the public captions;
 * the second founder's first name is still a placeholder pending team
 * confirmation — hence "Diego" stays until they weigh in. */
const FOUNDER_A = {
  name: "Borja",
  portraitUrl: "/v4/founders/founder-a.webp",
  alt: "Retrato de Borja, cofundador de DOSXM2, durante una visita a un piso en Getafe",
};
const FOUNDER_B = {
  name: "Diego",
  portraitUrl: "/v4/founders/founder-b.webp",
  alt: "Retrato del otro cofundador de DOSXM2 presentando un piso en el sur de Madrid",
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

const DOSXM2_PHONE = "34600000000"; // placeholder — swap with real number at launch
const WA_MESSAGE =
  "Hola DOSXM2, quiero información sobre cómo vender mi casa en Madrid.";

function buildWhatsAppUrl() {
  const clean = DOSXM2_PHONE.replace(/[^\d]/g, "");
  return `https://wa.me/${clean}?text=${encodeURIComponent(WA_MESSAGE)}`;
}

export default function V4Page() {
  const whatsappUrl = buildWhatsAppUrl();

  return (
    <>
      <Head>
        <title>DOSXM2 — Vendemos tu casa como si fuese la nuestra</title>
        <meta
          name="description"
          content="DOSXM2: dos expertos que venden tu casa en Madrid con trato personal, doble compromiso y resultados demostrables."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
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
        <V4Diferencial founderA={FOUNDER_A} founderB={FOUNDER_B} />
        <V4Metrics metrics={METRICS} />
        <V4Historias />
        <V4Resenas />
        <V4Valorador whatsappUrl={whatsappUrl} />
        <V4Footer whatsappUrl={whatsappUrl} />
        <V4WhatsAppFAB
          phone={DOSXM2_PHONE}
          message={WA_MESSAGE}
          portraitAUrl={FOUNDER_A.portraitUrl}
          portraitAAlt={FOUNDER_A.alt}
          portraitBUrl={FOUNDER_B.portraitUrl}
          portraitBAlt={FOUNDER_B.alt}
        />
      </V4Layout>
    </>
  );
}
