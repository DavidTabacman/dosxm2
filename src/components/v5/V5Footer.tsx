import { InstagramIcon, TikTokIcon } from "../shared/SocialIcons";
import { V5_NAV_LINKS, V5_SOCIAL_URLS } from "./V5StickyHeader";
import styles from "./V5Footer.module.css";

export interface V5FooterProps {
  instagramUrl?: string;
  tiktokUrl?: string;
  founders?: ReadonlyArray<{ name: string; phone: string; email: string }>;
}

function formatEsPhone(phone: string): string {
  if (phone.length !== 11 || !phone.startsWith("34")) return `+${phone}`;
  return `+${phone.slice(0, 2)} ${phone.slice(2, 5)} ${phone.slice(5, 7)} ${phone.slice(7, 9)} ${phone.slice(9, 11)}`;
}

export default function V5Footer({
  instagramUrl = V5_SOCIAL_URLS.instagram,
  tiktokUrl = V5_SOCIAL_URLS.tiktok,
  founders = [],
}: V5FooterProps) {
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
            {V5_NAV_LINKS.map((link) => {
              const isExternal = link.kind === "external";
              // Footer is rendered on multiple pages — anchors that target
              // /v5 must include that prefix so the link works regardless
              // of where the footer is mounted.
              const href =
                link.kind === "anchor" ? `/v5${link.href}` : link.href;
              return (
                <li key={link.href}>
                  <a
                    href={href}
                    target={isExternal ? "_blank" : undefined}
                    rel={isExternal ? "noopener noreferrer" : undefined}
                  >
                    {link.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>

        <div className={styles.block}>
          <h3>Contacto</h3>
          <ul className={styles.founderList}>
            {founders.map((f) => (
              <li key={f.phone}>
                <span className={styles.founderName}>{f.name}</span>
                <ul className={styles.linkList}>
                  <li>
                    <a href={`mailto:${f.email}`}>{f.email}</a>
                  </li>
                  <li>
                    <a href={`tel:+${f.phone}`}>{formatEsPhone(f.phone)}</a>
                  </li>
                </ul>
              </li>
            ))}
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
