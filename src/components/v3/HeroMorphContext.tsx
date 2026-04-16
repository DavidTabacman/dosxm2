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

function easeOutQuart(t: number) {
  return 1 - Math.pow(1 - t, 4);
}

const DEBUG = process.env.NODE_ENV === "development";
const TAG = "V3-HeroMorph";

// Sub-phase boundaries within the MORPH phase
const ENTRANCE_END = 0.10;
const CROSSFADE_START = 0.70;
const MORPH_RADIUS_TARGET = 12; // px — visible card rounding

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

        // First card stays at default opacity (1) — it's off-screen
        const firstCard = firstCardRef.current;
        if (firstCard) {
          firstCard.style.removeProperty("--first-card-opacity");
        }
        return;
      }

      const portfolio = portfolioRef.current;

      /* ═══════════════════════════════════════════════════
         Phase 2 — INTERMEDIATE: layer hidden, sections occlude
         ═══════════════════════════════════════════════════ */
      if (!portfolio) {
        // Portfolio not mounted yet — stay intermediate
        if (DEBUG && currentPhaseRef.current !== "intermediate") {
          console.log(`[${TAG}] Phase → INTERMEDIATE (portfolio not mounted)`);
        }
        currentPhaseRef.current = "intermediate";
        resetLayer(layer);
        return;
      }

      const portfolioRect = portfolio.getBoundingClientRect();

      if (portfolioRect.top > vh) {
        // Portfolio hasn't entered viewport yet
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

        const firstCard = firstCardRef.current;
        if (firstCard) {
          firstCard.style.removeProperty("--first-card-opacity");
        }
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
        firstCard.style.removeProperty("--first-card-opacity");
        return;
      }

      // We're in the active MORPH phase
      if (DEBUG && currentPhaseRef.current !== "morph") {
        const cardRect = firstCard.getBoundingClientRect();
        console.log(
          `[${TAG}] Phase → MORPH — ` +
            `portfolioTop: ${Math.round(portfolioRect.top)}, ` +
            `card: ${Math.round(cardRect.left)},${Math.round(cardRect.top)} ` +
            `${Math.round(cardRect.width)}x${Math.round(cardRect.height)}`
        );
      }
      currentPhaseRef.current = "morph";

      // Elevate above portfolio section (z-index 2)
      layer.style.setProperty("--morph-z-index", "3");

      const cardRect = firstCard.getBoundingClientRect();

      /* ── Sub-phase: Entrance (0 → ENTRANCE_END) ── */
      if (progress <= ENTRANCE_END) {
        const entranceT = progress / ENTRANCE_END;

        // Fade in the morph layer
        layer.style.setProperty("--morph-opacity", String(entranceT));
        // Fade out the real first card as morph layer takes over
        firstCard.style.setProperty(
          "--first-card-opacity",
          String(1 - entranceT)
        );

        // Clip-path: start full-screen, begin shrinking
        const earlyEased = easeOutQuart(entranceT);
        const insetTop = earlyEased * cardRect.top * 0.15;
        const insetRight =
          earlyEased * (window.innerWidth - cardRect.right) * 0.15;
        const insetBottom = earlyEased * (vh - cardRect.bottom) * 0.15;
        const insetLeft = earlyEased * cardRect.left * 0.15;

        layer.style.setProperty("--morph-inset-top", `${insetTop}px`);
        layer.style.setProperty("--morph-inset-right", `${insetRight}px`);
        layer.style.setProperty("--morph-inset-bottom", `${insetBottom}px`);
        layer.style.setProperty("--morph-inset-left", `${insetLeft}px`);
        layer.style.setProperty("--morph-radius", "0px");
        layer.style.setProperty(
          "--morph-scale",
          String(0.92 + earlyEased * 0.08 * 0.15)
        );
        return;
      }

      /* ── Sub-phase: Main morph (ENTRANCE_END → CROSSFADE_START) ── */
      // Normalize progress within this sub-phase
      const morphT = clamp(
        (progress - ENTRANCE_END) / (CROSSFADE_START - ENTRANCE_END),
        0,
        1
      );
      const eased = easeOutQuart(morphT);

      // Blend from the entrance end-state (15% of target insets) to full card insets
      const blendFrom = 0.15;
      const blendedEased = blendFrom + eased * (1 - blendFrom);

      const insetTop = blendedEased * cardRect.top;
      const insetRight = blendedEased * (window.innerWidth - cardRect.right);
      const insetBottom = blendedEased * (vh - cardRect.bottom);
      const insetLeft = blendedEased * cardRect.left;
      const radius = eased * MORPH_RADIUS_TARGET;

      layer.style.setProperty("--morph-inset-top", `${insetTop}px`);
      layer.style.setProperty("--morph-inset-right", `${insetRight}px`);
      layer.style.setProperty("--morph-inset-bottom", `${insetBottom}px`);
      layer.style.setProperty("--morph-inset-left", `${insetLeft}px`);
      layer.style.setProperty("--morph-radius", `${radius}px`);
      layer.style.setProperty(
        "--morph-scale",
        String(0.92 + blendedEased * 0.08)
      );

      /* ── Sub-phase: Cross-fade (CROSSFADE_START → 1.0) ── */
      if (progress >= CROSSFADE_START) {
        const fadeT = clamp(
          (progress - CROSSFADE_START) / (1 - CROSSFADE_START),
          0,
          1
        );
        layer.style.setProperty("--morph-opacity", String(1 - fadeT));
        firstCard.style.setProperty("--first-card-opacity", String(fadeT));
      } else {
        // Main morph: layer fully visible, card hidden
        layer.style.setProperty("--morph-opacity", "1");
        firstCard.style.setProperty("--first-card-opacity", "0");
      }
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
