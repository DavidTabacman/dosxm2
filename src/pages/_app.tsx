import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { Montserrat, Poppins } from "next/font/google";
import Analytics from "@/components/Analytics";
import { pageview } from "@/lib/analytics";

const montserrat = Montserrat({
  variable: "--font-primary",
  subsets: ["latin"],
});

const poppins = Poppins({
  variable: "--font-secondary",
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  // Report SPA pageviews to GA4 on client-side navigation (no-op until
  // NEXT_PUBLIC_GA_ID is set). The initial load is covered by gtag config.
  useEffect(() => {
    const handle = (url: string) => pageview(url);
    router.events.on("routeChangeComplete", handle);
    return () => router.events.off("routeChangeComplete", handle);
  }, [router.events]);

  return (
    <div className={`${montserrat.className} ${montserrat.variable} ${poppins.variable}`}>
      <Component {...pageProps} />
      <Analytics />
    </div>
  );
}
