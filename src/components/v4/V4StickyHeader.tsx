import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { InstagramIcon, TikTokIcon } from "../shared/SocialIcons";
import styles from "./V4StickyHeader.module.css";

export const V4_NAV_LINKS: ReadonlyArray<{ href: string; label: string }> = [
  { href: "#diferencial", label: "El Diferencial" },
  { href: "#resultados", label: "Resultados" },
  { href: "#historias", label: "Historias" },
  { href: "#resenas", label: "Reseñas" },
  { href: "#valorador", label: "Valorador" },
];

export const V4_SOCIAL_URLS = {
  instagram: "https://www.instagram.com/dosxm2/",
  tiktok: "https://www.tiktok.com/@dosxm2",
} as const;

function scrollToAnchor(hash: string) {
  if (typeof document === "undefined") return;
  const target = document.querySelector(hash);
  if (!target) {
    console.warn(
      `[V4-StickyHeader] ⚠️ Anchor "${hash}" not found on page — nav link will not scroll. ` +
        `Reason: section with matching id has not mounted, or the hash is misspelled.`
    );
    return;
  }
  target.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function V4StickyHeader() {
  // Solid/transparent state — driven by IntersectionObserver on a 1px sentinel
  // placed at the top of the page. When sentinel leaves viewport, solid is on.
  const [isSolid, setIsSolid] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const toggleButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node) return;

    // SSR / unsupported-browser safety — default to solid (readable).
    // Can't use lazy init: initial render must match SSR output (transparent)
    // to avoid hydration mismatch; we upgrade to solid only on client.
    if (typeof IntersectionObserver === "undefined") {
      console.warn(
        `[V4-StickyHeader] ⚠️ IntersectionObserver unavailable — defaulting to solid header. ` +
          `Reason: likely SSR pre-hydration or a very old browser.`
      );
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsSolid(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Sentinel visible => near top => transparent header.
        setIsSolid(!entry.isIntersecting);
      },
      { threshold: 0, rootMargin: "0px" }
    );
    observer.observe(node);
    console.log(`[V4-StickyHeader] 👁️ Sentinel observer attached`);

    return () => observer.disconnect();
  }, []);

  // Close drawer on ESC, outside click, or hash change.
  useEffect(() => {
    if (!menuOpen) return;

    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        console.log(`[V4-StickyHeader] ⎋ ESC pressed — closing drawer`);
        setMenuOpen(false);
        toggleButtonRef.current?.focus();
      }
    }

    function handleHashChange() {
      setMenuOpen(false);
    }

    document.addEventListener("keydown", handleKey);
    window.addEventListener("hashchange", handleHashChange);

    return () => {
      document.removeEventListener("keydown", handleKey);
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, [menuOpen]);

  // Lock body scroll while drawer is open (mobile UX). iOS Safari ignores
  // `overflow: hidden` on <body>, so we use the fixed-position technique:
  // pin the body with a negative `top` equal to the current scroll, and
  // restore the scroll position on close.
  useEffect(() => {
    if (typeof document === "undefined") return;
    if (!menuOpen) return;
    const scrollY = window.scrollY;
    const b = document.body.style;
    const prev = {
      position: b.position,
      top: b.top,
      left: b.left,
      right: b.right,
      overflow: b.overflow,
    };
    b.position = "fixed";
    b.top = `-${scrollY}px`;
    b.left = "0";
    b.right = "0";
    b.overflow = "hidden";
    return () => {
      b.position = prev.position;
      b.top = prev.top;
      b.left = prev.left;
      b.right = prev.right;
      b.overflow = prev.overflow;
      window.scrollTo(0, scrollY);
    };
  }, [menuOpen]);

  const handleNavClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      e.preventDefault();
      // Update the hash so browser history reflects the section; scroll via JS
      // so scroll-padding-top is honored consistently across browsers.
      if (typeof history !== "undefined") {
        history.replaceState(null, "", href);
      }
      scrollToAnchor(href);
      setMenuOpen(false);
      console.log(`[V4-StickyHeader] 🔗 Nav click — scrolling to ${href}`);
    },
    []
  );

  const handleLogoClick = useCallback(() => {
    if (typeof window === "undefined") return;
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (typeof history !== "undefined") {
      history.replaceState(null, "", window.location.pathname);
    }
    setMenuOpen(false);
  }, []);

  return (
    <>
      {/* Sentinel at top — when off-screen, header is solid. */}
      <div ref={sentinelRef} className={styles.sentinel} aria-hidden="true" />

      <header
        className={`${styles.header} ${isSolid ? styles.headerSolid : ""}`}
        data-solid={isSolid}
        role="banner"
      >
        <button
          type="button"
          className={styles.logo}
          onClick={handleLogoClick}
          aria-label="DOSXM2 — Volver al inicio"
        >
          <Image
            src="/Nuevo Logo sin fondo.png"
            alt="DOSXM2 — Dos por metro cuadrado"
            width={200}
            height={100}
            className={styles.logoImage}
            priority
          />
        </button>

        <nav className={styles.nav} aria-label="Navegación principal">
          {V4_NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={styles.navLink}
              onClick={(e) => handleNavClick(e, link.href)}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className={styles.headerSocials} aria-label="Redes sociales">
          <a
            className={styles.iconLink}
            href={V4_SOCIAL_URLS.instagram}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram de DOSXM2"
          >
            <InstagramIcon />
          </a>
          <a
            className={styles.iconLink}
            href={V4_SOCIAL_URLS.tiktok}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="TikTok de DOSXM2"
          >
            <TikTokIcon />
          </a>
        </div>

        <button
          ref={toggleButtonRef}
          type="button"
          className={`${styles.menuToggle} ${menuOpen ? styles.menuToggleOpen : ""}`}
          onClick={() => setMenuOpen((v) => !v)}
          aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={menuOpen}
          aria-controls="v4-mobile-drawer"
        >
          <span className={styles.menuIcon} aria-hidden="true">
            <span />
          </span>
        </button>
      </header>

      {/* Mobile drawer — always mounted for transition, toggled via class. */}
      <div
        className={`${styles.drawerBackdrop} ${menuOpen ? styles.drawerBackdropOpen : ""}`}
        onClick={() => setMenuOpen(false)}
        aria-hidden="true"
      />
      <div
        id="v4-mobile-drawer"
        className={`${styles.drawer} ${menuOpen ? styles.drawerOpen : ""}`}
        aria-hidden={!menuOpen}
        role="dialog"
        aria-label="Menú de navegación"
      >
        {V4_NAV_LINKS.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className={styles.navLink}
            onClick={(e) => handleNavClick(e, link.href)}
            tabIndex={menuOpen ? 0 : -1}
          >
            {link.label}
          </a>
        ))}

        <div className={styles.drawerSocials} aria-label="Redes sociales">
          <a
            className={styles.iconLink}
            href={V4_SOCIAL_URLS.instagram}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram de DOSXM2"
            tabIndex={menuOpen ? 0 : -1}
          >
            <InstagramIcon />
          </a>
          <a
            className={styles.iconLink}
            href={V4_SOCIAL_URLS.tiktok}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="TikTok de DOSXM2"
            tabIndex={menuOpen ? 0 : -1}
          >
            <TikTokIcon />
          </a>
        </div>
      </div>
    </>
  );
}
