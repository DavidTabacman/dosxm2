import { InstagramIcon, TikTokIcon } from "../shared/SocialIcons";
import { V4_NAV_LINKS, V4_SOCIAL_URLS } from "./V4StickyHeader";
import styles from "./V4Footer.module.css";

export interface V4FooterProps {
  instagramUrl?: string;
  tiktokUrl?: string;
  whatsappUrl?: string;
  email?: string;
  founders?: ReadonlyArray<{ name: string; phone: string }>;
}

function formatEsPhone(phone: string): string {
  if (phone.length !== 11 || !phone.startsWith("34")) return `+${phone}`;
  return `+${phone.slice(0, 2)} ${phone.slice(2, 5)} ${phone.slice(5, 8)} ${phone.slice(8, 11)}`;
}

export default function V4Footer({
  instagramUrl = V4_SOCIAL_URLS.instagram,
  tiktokUrl = V4_SOCIAL_URLS.tiktok,
  whatsappUrl,
  email = "hola@dosxm2.com",
  founders = [],
}: V4FooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer} role="contentinfo">
      <div className={styles.inner}>
        <div>
          <h2 className={styles.logo}>DOSXM2</h2>
          <p className={styles.tagline}>
            Dos por metro cuadrado. Vendemos tu casa como si fuese la nuestra.
          </p>
        </div>

        <div className={styles.block}>
          <h3>Explora</h3>
          <ul className={styles.linkList}>
            {V4_NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a href={link.href}>{link.label}</a>
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.block}>
          <h3>Contacto</h3>
          <ul className={styles.linkList}>
            <li>
              <a href={`mailto:${email}`}>{email}</a>
            </li>
            {founders.map((f) => (
              <li key={f.phone}>
                <a href={`tel:+${f.phone}`}>
                  {f.name}
                  <span className={styles.separator}>·</span>
                  {formatEsPhone(f.phone)}
                </a>
              </li>
            ))}
            {whatsappUrl ? (
              <li>
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                  WhatsApp
                </a>
              </li>
            ) : null}
          </ul>
          <ul className={styles.contactSocials}>
            <li>
              <a
                className={styles.iconLink}
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram de DOSXM2"
              >
                <InstagramIcon />
              </a>
            </li>
            <li>
              <a
                className={styles.iconLink}
                href={tiktokUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok de DOSXM2"
              >
                <TikTokIcon />
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className={styles.bottom}>
        <span>© {year} DOSXM2 · Madrid · Todos los derechos reservados.</span>
      </div>
    </footer>
  );
}
