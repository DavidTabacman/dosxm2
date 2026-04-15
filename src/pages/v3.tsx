import Head from "next/head";
import { Cormorant_Garamond, Inter } from "next/font/google";
import V3Layout from "@/components/v3/V3Layout";
import HeroImmersive from "@/components/v3/HeroImmersive";
import ElDiferencial from "@/components/v3/ElDiferencial";
import LiveMetrics from "@/components/v3/LiveMetrics";
import HistoriasVendidas from "@/components/v3/PortfolioTable";
import PruebaSocial from "@/components/v3/PruebaSocial";
import Valorador from "@/components/v3/Valorador";

const cormorant = Cormorant_Garamond({
  variable: "--font-v3-serif",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
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
      <V3Layout fontClassName={`${cormorant.variable} ${inter.variable}`}>
        <HeroImmersive />
        <ElDiferencial />
        <LiveMetrics />
        <HistoriasVendidas />
        <PruebaSocial />
        <Valorador />
      </V3Layout>
    </>
  );
}
