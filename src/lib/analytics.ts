/**
 * GA4 scaffold (audit §4.13). No-op until NEXT_PUBLIC_GA_ID is set in the
 * environment, so this is safe to ship before an account exists. When set,
 * <Analytics> (src/components/Analytics.tsx) loads gtag.js and this module's
 * helpers report pageviews + the three conversions that matter for a lead-gen
 * site: WhatsApp click, phone click, form submit.
 *
 * GDPR NOTE: Spain requires prior consent for analytics cookies. Wire these
 * behind a consent banner / Google Consent Mode before launch — see the audit
 * report's "remaining work". Until NEXT_PUBLIC_GA_ID is set nothing loads.
 */
export const GA_ID = process.env.NEXT_PUBLIC_GA_ID ?? "";
export const isAnalyticsEnabled = GA_ID.length > 0;

type GtagArgs = [string, ...unknown[]];
declare global {
  interface Window {
    gtag?: (...args: GtagArgs) => void;
    dataLayer?: unknown[];
  }
}

/** SPA pageview on client-side route change. */
export function pageview(url: string): void {
  if (!isAnalyticsEnabled || typeof window === "undefined" || !window.gtag) return;
  window.gtag("config", GA_ID, { page_path: url });
}

/** Generic event. */
export function trackEvent(
  name: string,
  params: Record<string, unknown> = {}
): void {
  if (!isAnalyticsEnabled || typeof window === "undefined" || !window.gtag) return;
  window.gtag("event", name, params);
}

/** Conversion: a founder WhatsApp/CTA click. */
export function trackWhatsAppClick(founder?: string): void {
  trackEvent("whatsapp_click", { founder });
}

/** Conversion: a tel: click. */
export function trackPhoneClick(founder?: string): void {
  trackEvent("phone_click", { founder });
}

/** Conversion: contacto form submit. */
export function trackFormSubmit(): void {
  trackEvent("form_submit");
}
