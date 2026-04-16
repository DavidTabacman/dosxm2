import { useCallback, useEffect, useRef, useState } from "react";
// Note: useState still used for isDesktop and reducedMotion (rarely change, re-render OK)
import { useIntersectionObserver } from "../shared/useIntersectionObserver";
import { useSectionReveal } from "../shared/useSectionReveal";
import { useHeroMorph } from "./HeroMorphContext";
import styles from "./PortfolioTable.module.css";
import anim from "./v3-animations.module.css";

const STORIES = [
  {
    zona: "Chamberí",
    dias: 18,
    story: "La historia de un nuevo comienzo.",
    image:
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=1000&fit=crop",
  },
  {
    zona: "Salamanca",
    dias: 22,
    story: "Un legado familiar que encontró su siguiente capítulo.",
    image:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=1000&fit=crop",
  },
  {
    zona: "Retiro",
    dias: 31,
    story: "El hogar perfecto para una nueva etapa.",
    image:
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&h=1000&fit=crop",
  },
  {
    zona: "Moncloa",
    dias: 14,
    story: "Vendido en tiempo récord sin bajar el precio.",
    image:
      "https://images.unsplash.com/photo-1600573472592-401b489a3cdc?w=800&h=1000&fit=crop",
  },
  {
    zona: "Chamartín",
    dias: 27,
    story: "Una propiedad que encontró a su comprador ideal.",
    image:
      "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&h=1000&fit=crop",
  },
];

const TILT_THRESHOLD = 10; // max degrees of tilt

function StoryCard({
  zona,
  dias,
  story,
  image,
  index,
  total,
  isFirstCard,
  onFirstCardRef,
}: {
  zona: string;
  dias: number;
  story: string;
  image: string;
  index: number;
  total: number;
  isFirstCard?: boolean;
  onFirstCardRef?: (el: HTMLDivElement | null) => void;
}) {
  const [ref, isIntersecting] = useIntersectionObserver({
    threshold: 0.6,
    rootMargin: "0px",
  });
  const cardRef = useRef<HTMLDivElement>(null);

  // Stable combined ref — avoids re-registration on every render
  const combinedRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (typeof ref === "function") ref(node);
      (cardRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
      if (isFirstCard && onFirstCardRef) onFirstCardRef(node);
    },
    // ref from useIntersectionObserver is stable (useCallback inside the hook).
    // onFirstCardRef is stable (wrapped in useCallback in parent).
    // isFirstCard is a constant for each card instance.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [ref, isFirstCard, onFirstCardRef]
  );

  const isActive = isIntersecting;

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    try {
      const el = cardRef.current;
      if (!el || typeof window === "undefined") return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const rect = el.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;

      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      const rotateY = (TILT_THRESHOLD / 2 - x * TILT_THRESHOLD).toFixed(2);
      const rotateX = (y * TILT_THRESHOLD - TILT_THRESHOLD / 2).toFixed(2);
      // Compose with CSS hover lift (translateY -4px) so the tilt doesn't override it
      el.style.transform = `perspective(${rect.width}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    } catch (err) {
      console.error(
        `[V3-PortfolioTable] ❌ 3D tilt effect FAILED on card "${zona}" — ` +
        `Reason: ${err instanceof Error ? err.message : String(err)}`
      );
    }
  }

  function handleMouseLeave() {
    const el = cardRef.current;
    if (el) el.style.transform = "";
  }

  return (
    <div
      className={`${styles.card} ${isActive ? styles.cardActive : ""} ${isFirstCard ? styles.cardMorphTarget : ""}`}
      ref={combinedRef}
      role="group"
      aria-roledescription="diapositiva"
      aria-label={`${index + 1} de ${total}: Propiedad en ${zona}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className={styles.cardImage}
        src={image}
        alt={`Propiedad en ${zona}`}
        data-asset-type="property-story"
        loading="lazy"
      />
      <div className={styles.cardOverlay}>
        <span className={styles.cardZona}>{zona}</span>
        <span className={styles.cardDias}>Vendido en {dias} días</span>
        <p className={styles.cardStory}>{story}</p>
      </div>
    </div>
  );
}

export default function HistoriasVendidas() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const liveRegionRef = useRef<HTMLDivElement>(null);
  const [isDesktop, setIsDesktop] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const rafRef = useRef<number>(0);
  const prevActiveRef = useRef(-1);
  const [headingRef, headingRevealed] = useSectionReveal(0.15);
  const { registerPortfolioRef, registerFirstCardRef } = useHeroMorph();

  // Register portfolio section with morph context
  useEffect(() => {
    registerPortfolioRef(sectionRef.current);
    return () => registerPortfolioRef(null);
  }, [registerPortfolioRef]);

  const handleFirstCardRef = useCallback(
    (el: HTMLDivElement | null) => {
      registerFirstCardRef(el);
    },
    [registerFirstCardRef]
  );

  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const motionMql = window.matchMedia("(prefers-reduced-motion: reduce)");
      setReducedMotion(motionMql.matches);

      const mql = window.matchMedia("(min-width: 769px)");
      setIsDesktop(mql.matches);
      const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
      mql.addEventListener("change", handler);
      return () => mql.removeEventListener("change", handler);
    } catch (err) {
      console.error(
        `[V3-PortfolioTable] ❌ Failed to initialize media queries — ` +
        `Reason: ${err instanceof Error ? err.message : String(err)}. ` +
        `Scroll-jacking and motion preferences may not work correctly.`
      );
    }
  }, []);

  const useScrollJacking = isDesktop && !reducedMotion;

  // Scroll-jacking: direct DOM mutation (no React re-renders)
  useEffect(() => {
    const el = sectionRef.current;
    const track = trackRef.current;

    if (!useScrollJacking) {
      if (isDesktop && reducedMotion) {
        console.log(
          `[V3-PortfolioTable] ♿ prefers-reduced-motion — scroll-jacking disabled, using native scroll`
        );
      }
      return;
    }

    if (!el) {
      console.warn(
        `[V3-PortfolioTable] ⚠️ sectionRef is null — scroll-jacking won't work. ` +
        `Reason: section element not mounted or ref not attached.`
      );
      return;
    }

    if (!track) {
      console.warn(
        `[V3-PortfolioTable] ⚠️ trackRef is null — scroll-jacking won't work. ` +
        `Reason: track element not mounted or ref not attached.`
      );
      return;
    }

    const viewportEl = track.parentElement;
    if (!viewportEl) {
      console.warn(
        `[V3-PortfolioTable] ⚠️ track has no parent element — scroll-jacking won't work. ` +
        `Reason: track element is not nested inside a viewport container.`
      );
      return;
    }

    const scrollableWidth = track.scrollWidth - viewportEl.clientWidth;
    if (scrollableWidth <= 0) {
      console.warn(
        `[V3-PortfolioTable] ⚠️ No scrollable width (${scrollableWidth}px) — ` +
        `Reason: track.scrollWidth (${track.scrollWidth}) <= viewport.clientWidth (${viewportEl.clientWidth}). ` +
        `Cards may be too small or container too wide. Scroll-jacking will have no visible effect.`
      );
    }

    console.log(
      `[V3-PortfolioTable] 🎬 Scroll-jacking INITIALIZED — ` +
      `mode: direct DOM mutation, cards: ${STORIES.length}, ` +
      `scrollableWidth: ${scrollableWidth}px, sectionHeight: ${el.offsetHeight}px`
    );

    function update() {
      if (!el || !track || !viewportEl) return;
      try {
        const rect = el.getBoundingClientRect();
        const vh = window.innerHeight;
        const progress = Math.max(0, Math.min(1, (vh - rect.top) / (vh + rect.height)));

        const currentScrollableWidth = track.scrollWidth - viewportEl.clientWidth;
        const adjustedProgress = Math.max(0, Math.min(1, (progress - 0.05) / 0.9));
        const translateX = -adjustedProgress * currentScrollableWidth;

        // Direct DOM mutation — no setState, no re-render
        track.style.transform = `translateX(${translateX}px)`;

        // Calculate active card
        const cardWidth = track.scrollWidth / STORIES.length;
        if (cardWidth === 0) return;
        const centerOffset = viewportEl.clientWidth / 2;
        const scrollPos = adjustedProgress * currentScrollableWidth;
        let activeIndex = Math.round((scrollPos + centerOffset - cardWidth / 2) / cardWidth);
        activeIndex = Math.max(0, Math.min(STORIES.length - 1, activeIndex));

        // Toggle active class directly on DOM elements
        const cards = track.children;
        for (let i = 0; i < cards.length; i++) {
          cards[i].classList.toggle(styles.cardActive, i === activeIndex);
        }

        // Update ARIA live region when active card changes
        if (activeIndex !== prevActiveRef.current && liveRegionRef.current) {
          liveRegionRef.current.textContent = `Propiedad en ${STORIES[activeIndex].zona}`;
          prevActiveRef.current = activeIndex;
        }
      } catch (err) {
        console.error(
          `[V3-PortfolioTable] ❌ Scroll-jacking update FAILED — ` +
          `Reason: ${err instanceof Error ? err.message : String(err)}`
        );
      }
    }

    function handleScroll() {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(update);
    }

    try {
      window.addEventListener("scroll", handleScroll, { passive: true });
      update();
    } catch (err) {
      console.error(
        `[V3-PortfolioTable] ❌ Failed to attach scroll-jacking listener — ` +
        `Reason: ${err instanceof Error ? err.message : String(err)}`
      );
    }

    return () => {
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(rafRef.current);
    };
  }, [useScrollJacking, isDesktop, reducedMotion]);

  return (
    <section
      className={`${styles.section} ${useScrollJacking ? styles.sectionDesktop : ""}`}
      ref={sectionRef}
    >
      <div className={useScrollJacking ? styles.stickyContainer : undefined}>
        <h2
          className={`${styles.heading} ${anim.revealTarget} ${headingRevealed ? anim.revealTargetVisible : ""}`}
          ref={headingRef}
        >Historias Vendidas</h2>
        <div
          className={styles.trackViewport}
          role="region"
          aria-roledescription="carrusel"
          aria-label="Portfolio de propiedades"
        >
          <div
            className={`${styles.track} ${useScrollJacking ? styles.trackDesktop : ""}`}
            ref={trackRef}
          >
            {STORIES.map((s, i) => (
              <StoryCard
                key={s.zona}
                zona={s.zona}
                dias={s.dias}
                story={s.story}
                image={s.image}
                index={i}
                total={STORIES.length}
                isFirstCard={i === 0}
                onFirstCardRef={i === 0 ? handleFirstCardRef : undefined}
              />
            ))}
          </div>
        </div>
        <div aria-live="polite" className={styles.srOnly} ref={liveRegionRef} />
      </div>
    </section>
  );
}
