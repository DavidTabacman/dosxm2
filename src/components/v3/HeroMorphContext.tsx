import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  type ReactNode,
  type RefObject,
} from "react";

interface HeroMorphContextValue {
  registerHeroRef: (el: HTMLElement | null) => void;
  registerPortfolioRef: (el: HTMLElement | null) => void;
  registerFirstCardRef: (el: HTMLElement | null) => void;
  morphLayerRef: RefObject<HTMLDivElement | null>;
}

const HeroMorphContext = createContext<HeroMorphContextValue>({
  registerHeroRef: () => {},
  registerPortfolioRef: () => {},
  registerFirstCardRef: () => {},
  morphLayerRef: { current: null },
});

export function useHeroMorph() {
  return useContext(HeroMorphContext);
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

const DEBUG = process.env.NODE_ENV === "development";
const TAG = "V3-HeroMorph";

// Sub-phase boundaries within the MORPH phase
const FADE_IN_END = 0.12; // morph layer opacity 0 → 1
const CROSSFADE_START = 0.80; // morph layer fades out, card revealed
const MORPH_RADIUS_TARGET = 12; // px

export function HeroMorphProvider({ children }: { children: ReactNode }) {
  const heroRef = useRef<HTMLElement | null>(null);
  const portfolioRef = useRef<HTMLElement | null>(null);
  const firstCardRef = useRef<HTMLElement | null>(null);
  const morphLayerRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef(0);
  const isDesktopRef = useRef(false);
  const reducedMotionRef = useRef(false);
  const currentPhaseRef = useRef<
    "hero" | "intermediate" | "morph" | "post-morph" | "none"
  >("none");

  const registerHeroRef = useCallback((el: HTMLElement | null) => {
    heroRef.current = el;
    if (DEBUG && el) {
      console.log(
        `[${TAG}] Hero ref registered — ` +
          `offsetTop: ${el.offsetTop}px, offsetHeight: ${el.offsetHeight}px`
      );
    }
  }, []);

  const registerPortfolioRef = useCallback((el: HTMLElement | null) => {
    portfolioRef.current = el;
    if (DEBUG && el) {
      console.log(
        `[${TAG}] Portfolio ref registered — ` +
          `offsetTop: ${el.offsetTop}px, offsetHeight: ${el.offsetHeight}px`
      );
    }
  }, []);

  const registerFirstCardRef = useCallback((el: HTMLElement | null) => {
    firstCardRef.current = el;
    if (DEBUG && el) {
      const rect = el.getBoundingClientRect();
      console.log(
        `[${TAG}] First card ref registered — ` +
          `rect: ${Math.round(rect.left)},${Math.round(rect.top)} ` +
          `${Math.round(rect.width)}x${Math.round(rect.height)}`
      );
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const checkDesktop = () => {
      isDesktopRef.current = window.matchMedia("(min-width: 769px)").matches;
    };

    try {
      reducedMotionRef.current = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
    } catch {
      reducedMotionRef.current = false;
    }

    checkDesktop();
    window.addEventListener("resize", checkDesktop);

    if (reducedMotionRef.current) {
      if (DEBUG) console.log(`[${TAG}] prefers-reduced-motion — morph disabled`);
      if (morphLayerRef.current) {
        morphLayerRef.current.style.display = "none";
      }
      return () => window.removeEventListener("resize", checkDesktop);
    }

    if (DEBUG) {
      console.log(
        `[${TAG}] Morph scroll listener INITIALIZED — ` +
          `isDesktop: ${isDesktopRef.current}`
      );
    }

    /* ── Helper: reset the morph layer to a neutral hidden state ── */
    function resetLayer(layer: HTMLDivElement) {
      layer.style.setProperty("--morph-z-index", "1");
      layer.style.setProperty("--morph-inset-top", "0px");
      layer.style.setProperty("--morph-inset-right", "0px");
      layer.style.setProperty("--morph-inset-bottom", "0px");
      layer.style.setProperty("--morph-inset-left", "0px");
      layer.style.setProperty("--morph-radius", "0px");
      layer.style.setProperty("--morph-opacity", "0");
      layer.style.setProperty("--morph-scale", "1");
    }

    /* ── Main scroll update (called every rAF on scroll) ── */
    function update() {
      const layer = morphLayerRef.current;
      if (!layer || !isDesktopRef.current) return;

      const hero = heroRef.current;
      if (!hero) return;

      const vh = window.innerHeight;
      const vw = window.innerWidth;
      const scrollY = window.scrollY;

      const heroTop = hero.offsetTop;
      const heroHeight = hero.offsetHeight;
      const heroBottom = heroTop + heroHeight;

      /* ═══════════════════════════════════════════════════
         Phase 1 — HERO: full-screen video, subtle scale-down
         ═══════════════════════════════════════════════════ */
      if (scrollY < heroBottom) {
        if (DEBUG && currentPhaseRef.current !== "hero") {
          console.log(`[${TAG}] Phase → HERO`);
        }
        currentPhaseRef.current = "hero";

        const heroProgress = clamp(scrollY / heroHeight, 0, 1);
        const scale = 1 - heroProgress * 0.08; // 1.0 → 0.92

        layer.style.setProperty("--morph-z-index", "1");
        layer.style.setProperty("--morph-inset-top", "0px");
        layer.style.setProperty("--morph-inset-right", "0px");
        layer.style.setProperty("--morph-inset-bottom", "0px");
        layer.style.setProperty("--morph-inset-left", "0px");
        layer.style.setProperty("--morph-radius", "0px");
        layer.style.setProperty("--morph-opacity", "1");
        layer.style.setProperty("--morph-scale", String(scale));
        return;
      }

      const portfolio = portfolioRef.current;

      /* ═══════════════════════════════════════════════════
         Phase 2 — INTERMEDIATE: layer hidden behind opaque sections
         ═══════════════════════════════════════════════════ */
      if (!portfolio) {
        if (DEBUG && currentPhaseRef.current !== "intermediate") {
          console.log(`[${TAG}] Phase → INTERMEDIATE (portfolio not mounted)`);
        }
        currentPhaseRef.current = "intermediate";
        resetLayer(layer);
        return;
      }

      const portfolioRect = portfolio.getBoundingClientRect();

      if (portfolioRect.top > vh) {
        if (DEBUG && currentPhaseRef.current !== "intermediate") {
          console.log(
            `[${TAG}] Phase → INTERMEDIATE — portfolioTop: ${Math.round(portfolioRect.top)}`
          );
        }
        currentPhaseRef.current = "intermediate";

        layer.style.setProperty("--morph-z-index", "1");
        layer.style.setProperty("--morph-inset-top", "0px");
        layer.style.setProperty("--morph-inset-right", "0px");
        layer.style.setProperty("--morph-inset-bottom", "0px");
        layer.style.setProperty("--morph-inset-left", "0px");
        layer.style.setProperty("--morph-radius", "0px");
        layer.style.setProperty("--morph-opacity", "0");
        layer.style.setProperty("--morph-scale", "0.92");
        return;
      }

      /* ═══════════════════════════════════════════════════
         Phase 3 — MORPH: video transforms into first card
         ═══════════════════════════════════════════════════ */
      const firstCard = firstCardRef.current;
      if (!firstCard) {
        if (DEBUG && currentPhaseRef.current !== "morph") {
          console.log(`[${TAG}] Phase → MORPH (firstCard not registered)`);
        }
        currentPhaseRef.current = "morph";
        resetLayer(layer);
        return;
      }

      // progress: 0 when portfolio top = vh, 1 when portfolio top = 0
      const rawProgress = 1 - portfolioRect.top / vh;
      const progress = clamp(rawProgress, 0, 1);

      if (progress >= 1) {
        /* ═══════════════════════════════════════════════════
           Phase 4 — POST-MORPH: layer hidden, card visible
           ═══════════════════════════════════════════════════ */
        if (DEBUG && currentPhaseRef.current !== "post-morph") {
          console.log(`[${TAG}] Phase → POST-MORPH`);
        }
        currentPhaseRef.current = "post-morph";
        resetLayer(layer);
        return;
      }

      // Active MORPH phase
      if (DEBUG && currentPhaseRef.current !== "morph") {
        console.log(
          `[${TAG}] Phase → MORPH — portfolioTop: ${Math.round(portfolioRect.top)}`
        );
      }
      currentPhaseRef.current = "morph";

      // Elevate above portfolio section (z-index 2)
      layer.style.setProperty("--morph-z-index", "3");

      // ── Target position: where the card WILL BE when the sticky container pins ──
      // The card's current rect is offset by the section's scroll position.
      // Subtracting portfolioRect.top gives us the card's position within
      // the section, which equals its viewport position when the section
      // top reaches 0 (sticky container pinned).
      const cardRect = firstCard.getBoundingClientRect();
      const sectionOffset = Math.max(portfolioRect.top, 0);
      const targetTop = cardRect.top - sectionOffset;
      const targetBottom = cardRect.bottom - sectionOffset;
      const targetLeft = cardRect.left;
      const targetRight = cardRect.right;

      // Ensure target is within viewport bounds (clamp to avoid negative insets
      // that would expand clip-path beyond the element)
      const clampedTargetTop = Math.max(0, targetTop);
      const clampedTargetBottom = Math.min(vh, targetBottom);
      const clampedTargetLeft = Math.max(0, targetLeft);
      const clampedTargetRight = Math.min(vw, targetRight);

      // ── Morph easing ──
      const eased = easeOutCubic(progress);

      // Clip-path: full-screen → target card shape
      const insetTop = eased * clampedTargetTop;
      const insetRight = eased * (vw - clampedTargetRight);
      const insetBottom = eased * (vh - clampedTargetBottom);
      const insetLeft = eased * clampedTargetLeft;
      const radius = eased * MORPH_RADIUS_TARGET;

      layer.style.setProperty("--morph-inset-top", `${insetTop}px`);
      layer.style.setProperty("--morph-inset-right", `${insetRight}px`);
      layer.style.setProperty("--morph-inset-bottom", `${insetBottom}px`);
      layer.style.setProperty("--morph-inset-left", `${insetLeft}px`);
      layer.style.setProperty("--morph-radius", `${radius}px`);
      layer.style.setProperty("--morph-scale", String(0.92 + eased * 0.08));

      // ── Opacity: fade in at start, fade out at end ──
      // The first card is always visible (opacity 1). The morph layer at
      // z-index 3 covers it while visible. When the morph layer fades out
      // at the end, the real card is revealed underneath.
      let layerOpacity = 1;

      if (progress < FADE_IN_END) {
        // Fade in
        layerOpacity = progress / FADE_IN_END;
      } else if (progress > CROSSFADE_START) {
        // Cross-fade out — reveal the real card underneath
        const fadeT = (progress - CROSSFADE_START) / (1 - CROSSFADE_START);
        layerOpacity = 1 - fadeT;
      }

      layer.style.setProperty("--morph-opacity", String(layerOpacity));
    }

    function handleScroll() {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(update);
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    update(); // Initial state

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", checkDesktop);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const value: HeroMorphContextValue = {
    registerHeroRef,
    registerPortfolioRef,
    registerFirstCardRef,
    morphLayerRef,
  };

  return (
    <HeroMorphContext.Provider value={value}>
      {children}
    </HeroMorphContext.Provider>
  );
}