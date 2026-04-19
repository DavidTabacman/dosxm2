/**
 * Builds a wa.me URL with a digits-only phone and an optional message.
 * Keeps call sites out of the weeds of URI-encoding and phone sanitisation.
 */
export function buildWhatsAppUrl(phone: string, message?: string): string {
  const cleanPhone = phone.replace(/[^\d]/g, "");
  const base = `https://wa.me/${cleanPhone}`;
  if (!message) return base;
  return `${base}?text=${encodeURIComponent(message)}`;
}
