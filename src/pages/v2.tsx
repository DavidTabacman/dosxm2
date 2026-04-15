import Head from "next/head";
import { DM_Sans } from "next/font/google";
import V2Layout from "@/components/v2/V2Layout";
import HeroPortrait from "@/components/v2/HeroPortrait";
import ChatSection from "@/components/v2/ChatSection";
import ConversationalForm from "@/components/v2/ConversationalForm";

const dmSans = DM_Sans({
  variable: "--font-v2-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default function V2Page() {
  return (
    <>
      <Head>
        <title>DOSXM2 — El Diálogo Abierto</title>
        <meta
          name="description"
          content="Hola. Somos DOSXM2. Y vendemos tu casa como si fuese la nuestra."
        />
      </Head>
      <V2Layout fontClassName={dmSans.variable}>
        <HeroPortrait />
        <ChatSection />
        <ConversationalForm />
      </V2Layout>
    </>
  );
}
