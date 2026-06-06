import Image from "next/image";
import { useRouter } from "next/router";
import { useCallback, useEffect, useRef, useState } from "react";
import { InstagramIcon, TikTokIcon } from "../shared/SocialIcons";
import styles from "./V4StickyHeader.module.css";

/**
 * `kind` semantics:
 *   - "anchor"   — fragment id on the homepage (/). Clicking from / smooth-
 *                  scrolls in place; clicking from any other page lets the
 *                  browser do a full-page navigation to / + href (the href
 *                  attribute is rewritten below). We don't use router.push for
 *                  hash navigation — see next.js #18601, #37552, #20125.
 *   - "page"     — a different Next.js route. router.push handles client nav.
 *   - "external" — opens in a new tab; styled as the Valorador CTA pill.
 */
export type V4NavKind = "anchor" | "page" | "external";

export interface V4NavLink {
  href: string;
  label: string;
  kind: V4NavKind;
}

export const V4_NAV_LINKS: ReadonlyArray<V4NavLink> = [
  { href: "#diferencial", label: "Por qué elegirnos", kind: "anchor" },
  { href: "/conocenos", label: "Conócenos", kind: "page" },
  { href: "#resultados", label: "Resultados", kind: "anchor" },
  { href: "#historias", label: "Vendidas", kind: "anchor" },
  { href: "#resenas", label: "Reseñas", kind: "anchor" },
  { href: "#contacto", label: "Contacto", kind: "anchor" },
  {
    href: "https://valuation.lystos.com/?clientId=cadc5d64-196d-4b14-a542-0858ecf58bd0&utm_source=web&utm_medium=cta&utm_content=nav",
    label: "Valorador",
    kind: "external",
  },
];

/** Compute the actual `href` attribute for a link given the current path.
 *  Anchor links living on the homepage (`/`) stay bare (`#hash`); anywhere
 *  else they get a `/` prefix (→ `/#hash`) so the browser navigates to the
 *  homepage first. Page and external links pass through unchanged. */
export function resolveNavHref(link: V4NavLink, currentPathname: string): string {
  if (link.kind === "anchor" && currentPathname !== "/") {
    return `/${link.href}`;
  }
  return link.href;
}

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

export default function V4StickyHeader({
  alwaysSolid = false,
}: {
  alwaysSolid?: boolean;
} = {}) {
  // Solid/transparent state — driven by IntersectionObserver on a 1px sentinel
  // placed at the top of the page. When sentinel leaves viewport, solid is on.
  // `alwaysSolid` forces solid from first paint (for pages with light heroes
  // where the white logo would be invisible against the background).
  const [isSolid, setIsSolid] = useState(alwaysSolid);
  const [menuOpen, setMenuOpen] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const toggleButtonRef = useRef<HTMLButtonElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (alwaysSolid) return;
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
  }, [alwaysSolid]);

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

  // When the drawer is open the body is position:fixed, so any smooth scroll
  // (scrollIntoView or window.scrollTo) silently no-ops — the document isn't
  // scrollable while locked, and the lock effect's cleanup later restores the
  // original scrollY, stranding the user at their pre-open position. Defer
  // the scroll until after React flushes the cleanup that unfixes body.
  const scrollAfterDrawerCloses = useCallback(
    (fn: () => void) => {
      if (menuOpen && typeof requestAnimationFrame !== "undefined") {
        requestAnimationFrame(fn);
      } else {
        fn();
      }
    },
    [menuOpen]
  );

  const handleNavClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, link: V4NavLink) => {
      // External: let the browser open the URL in a new tab. Just close
      // the drawer (if open) and stay out of the way.
      if (link.kind === "external") {
        setMenuOpen(false);
        console.log(`[V4-StickyHeader] 🔗 External nav — ${link.href}`);
        return;
      }

      // Page navigation: client-side route push via Next.js router.
      if (link.kind === "page") {
        e.preventDefault();
        setMenuOpen(false);
        scrollAfterDrawerCloses(() => {
          void router.push(link.href);
        });
        console.log(`[V4-StickyHeader] 🔗 Page nav — push ${link.href}`);
        return;
      }

      // Anchor on the current homepage (/): smooth-scroll in place.
      if (router.pathname === "/") {
        e.preventDefault();
        if (typeof history !== "undefined") {
          history.replaceState(null, "", link.href);
        }
        setMenuOpen(false);
        scrollAfterDrawerCloses(() => scrollToAnchor(link.href));
        console.log(
          `[V4-StickyHeader] 🔗 In-page anchor — scrolling to ${link.href}`
        );
        return;
      }

      // Anchor from a non-homepage page (e.g. /conocenos). The href attribute
      // is already "/#hash" (via resolveNavHref), so DON'T preventDefault —
      // let the browser do full-page navigation. Native hash scroll + the
      // section's scroll-margin-top handle the sticky-header offset.
      // We avoid router.push("/#hash") because of known scroll-bug issues
      // (next.js #18601, #37552, #20125).
      setMenuOpen(false);
      console.log(
        `[V4-StickyHeader] 🔗 Cross-page anchor — browser nav to /${link.href}`
      );
    },
    [router, scrollAfterDrawerCloses]
  );

  const handleLogoClick = useCallback(() => {
    if (typeof window === "undefined") return;
    setMenuOpen(false);

    // From any non-homepage route (e.g. /conocenos), navigate to the homepage.
    if (router.pathname !== "/") {
      router.push("/");
      return;
    }

    // Already on the homepage: strip any #hash and smooth-scroll to top.
    if (typeof history !== "undefined") {
      history.replaceState(null, "", window.location.pathname);
    }
    scrollAfterDrawerCloses(() =>
      window.scrollTo({ top: 0, behavior: "smooth" })
    );
  }, [router, scrollAfterDrawerCloses]);

  return (
    <>
      {/* Sentinel at top — when off-screen, header is solid. */}
      <div ref={sentinelRef} className={styles.sentinel} aria-hidden="true" />

      <header
        className={`${styles.header} ${isSolid ? styles.headerSolid : ""}`}
        data-solid={isSolid}
        role="banner"
      >
        <div className={styles.headerLeft}>
          <nav className={styles.nav} aria-label="Navegación principal">
            {V4_NAV_LINKS.map((link) => {
              const isExternal = link.kind === "external";
              return (
                <a
                  key={link.href}
                  href={resolveNavHref(link, router.pathname)}
                  target={isExternal ? "_blank" : undefined}
                  rel={isExternal ? "noopener noreferrer" : undefined}
                  className={`${styles.navLink} ${isExternal ? styles.navCta : ""}`}
                  onClick={(e) => handleNavClick(e, link)}
                >
                  {link.label}
                </a>
              );
            })}
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
        </div>

        <button
          type="button"
          className={styles.logo}
          onClick={handleLogoClick}
          aria-label="DOSXM2 — Volver al inicio"
        >
          <span className={styles.logoStack}>
            <Image
              src="/Nuevo Logo sin fondo.png"
              alt="DOSXM2 — Dos por metro cuadrado"
              width={200}
              height={100}
              className={styles.logoImage}
              priority
            />
            {/* Dark variant cross-fades in when header goes solid — the light
                logo's silvery "X" loses contrast against the translucent beige
                background, so we swap to dark letters (gold house preserved). */}
            <Image
              src="/Nuevo Logo oscuro.png"
              alt=""
              aria-hidden="true"
              width={200}
              height={100}
              className={`${styles.logoImage} ${styles.logoImageDark}`}
            />
          </span>
        </button>

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
        {V4_NAV_LINKS.map((link) => {
          const isExternal = link.kind === "external";
          return (
            <a
              key={link.href}
              href={resolveNavHref(link, router.pathname)}
              target={isExternal ? "_blank" : undefined}
              rel={isExternal ? "noopener noreferrer" : undefined}
              className={`${styles.navLink} ${isExternal ? styles.navCta : ""}`}
              onClick={(e) => handleNavClick(e, link)}
              tabIndex={menuOpen ? 0 : -1}
            >
              {link.label}
            </a>
          );
        })}

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
