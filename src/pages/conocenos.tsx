import { Fraunces, Inter } from "next/font/google";
import Seo from "@/components/Seo";
import { conocenosGraph } from "@/lib/jsonld";
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
      <Seo
        title="Conócenos — Pablo y Borja · DOSXM2 Madrid"
        description="Pablo y Borja, fundadores de DOSXM2. De Banfield y Getafe a Madrid, una década en multinacionales y un objetivo: vender tu casa como si fuese la nuestra."
        path="/conocenos"
        ogImage="/v4/founders/together.webp"
        ogImageAlt="Pablo y Borja, los dos fundadores de DOSXM2"
        preloadImage={{ href: FOUNDER_PABLO.portraitUrl, type: "image/webp" }}
        jsonLd={conocenosGraph()}
      />
      <V4Layout fontClassName={`${fraunces.variable} ${inter.variable}`}>
        <V4StickyHeader alwaysSolid />
        <V4Conocenos />
        <V4Footer founders={FOUNDERS} />
      </V4Layout>
    </>
  );
}
