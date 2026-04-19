import { V4_NAV_LINKS } from "./V4StickyHeader";
import styles from "./V4Footer.module.css";

export interface V4FooterProps {
  instagramUrl?: string;
  tiktokUrl?: string;
  whatsappUrl?: string;
  email?: string;
}

export default function V4Footer({
  instagramUrl = "https://www.instagram.com/dosxm2/",
  tiktokUrl = "https://www.tiktok.com/@dosxm2",
  whatsappUrl,
  email = "hola@dosxm2.com",
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
            {whatsappUrl ? (
              <li>
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                  WhatsApp
                </a>
              </li>
            ) : null}
          </ul>
        </div>
      </div>

      <div className={styles.bottom}>
        <span>© {year} DOSXM2 · Madrid · Todos los derechos reservados.</span>
        <ul className={styles.socialList}>
          <li>
            <a href={instagramUrl} target="_blank" rel="noopener noreferrer">
              Instagram
            </a>
          </li>
          <li>
            <a href={tiktokUrl} target="_blank" rel="noopener noreferrer">
              TikTok
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
}
