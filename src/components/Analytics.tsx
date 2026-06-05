import Script from "next/script";
import { GA_ID, isAnalyticsEnabled } from "@/lib/analytics";

/**
 * GA4 loader. Renders nothing unless NEXT_PUBLIC_GA_ID is set, so the site
 * ships analytics-ready with zero network/cookie impact until an ID exists
 * (audit §4.13). Loaded `afterInteractive` so it never blocks LCP/INP.
 *
 * GDPR: gate this behind a consent banner before launch (see lib/analytics.ts).
 */
export default function Analytics() {
  if (!isAnalyticsEnabled) return null;
  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_ID}', { anonymize_ip: true });`}
      </Script>
    </>
  );
}
