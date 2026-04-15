import Head from "next/head";
import { Playfair_Display, Space_Grotesk } from "next/font/google";
import V1Layout from "@/components/v1/V1Layout";
import HeroSplit from "@/components/v1/HeroSplit";
import PortfolioGrid from "@/components/v1/PortfolioGrid";
import MetricsCounter from "@/components/v1/MetricsCounter";

const playfair = Playfair_Display({
  variable: "--font-v1-serif",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-v1-sans",
  subsets: ["latin"],
});

export default function V1Page() {
  return (
    <>
      <Head>
        <title>DOSXM2 — La Dualidad Cinematográfica</title>
        <meta
          name="description"
          content="Vendemos tu casa como si fuese la nuestra. El poder de dos."
        />
      </Head>
      <V1Layout fontClassName={`${playfair.variable} ${spaceGrotesk.variable}`}>
        <HeroSplit />
        <PortfolioGrid />
        <MetricsCounter />
      </V1Layout>
    </>
  );
}
