import Head from "next/head";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import V3Layout from "@/components/v3/V3Layout";
import HeroTerminal from "@/components/v3/HeroTerminal";
import LiveMetrics from "@/components/v3/LiveMetrics";
import PortfolioTable from "@/components/v3/PortfolioTable";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-v3-sans",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-v3-mono",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export default function V3Page() {
  return (
    <>
      <Head>
        <title>DOSXM2 — La Transparencia Radical</title>
        <meta
          name="description"
          content="Vendemos tu casa como si fuese la nuestra. Datos reales, transparencia total."
        />
      </Head>
      <V3Layout fontClassName={`${spaceGrotesk.variable} ${jetbrainsMono.variable}`}>
        <HeroTerminal />
        <LiveMetrics />
        <PortfolioTable />
      </V3Layout>
    </>
  );
}
