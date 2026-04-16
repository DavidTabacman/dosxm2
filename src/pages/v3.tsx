import Head from "next/head";
import { Instrument_Serif, Inter } from "next/font/google";
import V3Layout from "@/components/v3/V3Layout";
import { HeroMorphProvider } from "@/components/v3/HeroMorphContext";
import HeroMorphLayer from "@/components/v3/HeroMorphLayer";
import HeroImmersive from "@/components/v3/HeroImmersive";
import ElDiferencial from "@/components/v3/ElDiferencial";
import LiveMetrics from "@/components/v3/LiveMetrics";
import HistoriasVendidas from "@/components/v3/PortfolioTable";
import PruebaSocial from "@/components/v3/PruebaSocial";
import Valorador from "@/components/v3/Valorador";

const instrumentSerif = Instrument_Serif({
  variable: "--font-v3-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

const inter = Inter({
  variable: "--font-v3-sans",
  subsets: ["latin"],
});

export default function V3Page() {
  return (
    <>
      <Head>
        <title>DOSXM2 — El Viaje Inmersivo</title>
        <meta
          name="description"
          content="Tu casa. Nuestra dedicación. El poder de dos expertos trabajando para ti."
        />
      </Head>
      <V3Layout fontClassName={`${instrumentSerif.variable} ${inter.variable}`}>
        <HeroMorphProvider>
          <HeroMorphLayer />
          <HeroImmersive />
          <ElDiferencial />
          <LiveMetrics />
          <HistoriasVendidas />
          <PruebaSocial />
          <Valorador />
        </HeroMorphProvider>
      </V3Layout>
    </>
  );
}
