import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Montserrat, Poppins } from "next/font/google";

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
  return (
    <div className={`${montserrat.className} ${montserrat.variable} ${poppins.variable}`}>
      <Component {...pageProps} />
    </div>
  );
}
