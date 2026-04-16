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

function smoothstep(t: number) {
  return t * t * (3 - 2 * t);
}

const TAG = "V3-HeroMorph";

export function HeroMorphProvider({ children }: { children: ReactNode }) {
  const heroRef = useRef<HTMLElement | null>(null);
  const portfolioRef = useRef<HTMLElement | null>(null);
  const firstCardRef = useRef<HTMLElement | null>(null);
  const morphLayerRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef(0);
  const isDesktopRef = useRef(false);
  const reducedMotionRef = useRef(false);
  // Track current phase to log transitions (not every frame)
  const currentPhaseRef = useRef<"hero" | "intermediate" | "morph" | "none">("none");

  const registerHeroRef = useCallback((el: HTMLElement | null) => {
    heroRef.current = el;
    if (el) {
      console.log(
        `[${TAG}] 📍 Hero ref registered — ` +
        `offsetTop: ${el.offsetTop}px, offsetHeight: ${el.offsetHeight}px`
      );
    }
  }, []);

  const registerPortfolioRef = useCallback((el: HTMLElement | null) => {
    portfolioRef.current = el;
    if (el) {
      console.log(
        `[${TAG}] 📍 Portfolio ref registered — ` +
        `offsetTop: ${el.offsetTop}px, offsetHeight: ${el.offsetHeight}px`
      );
    }
  }, []);

  const registerFirstCardRef = useCallback((el: HTMLElement | null) => {
    firstCardRef.current = el;
    if (el) {
      const rect = el.getBoundingClientRect();
      console.log(
        `[${TAG}] 📍 First card ref registered — ` +
        `rect: ${Math.round(rect.left)},${Math.round(rect.top)} ${Math.round(rect.width)}x${Math.round(rect.height)}`
      );
    }
  }, []);

  useEffect(() => {
    // Check desktop and reduced motion
    if (typeof window === "undefined") return;

    const checkDesktop = () => {
      const was = isDesktopRef.current;
      isDesktopRef.current = window.matchMedia("(min-width: 769px)").matches;
      if (was !== isDesktopRef.current) {
        console.log(
          `[${TAG}] 🖥️ Desktop mode changed: ${was} → ${isDesktopRef.current}`
        );
      }
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
      console.log(`[${TAG}] ♿ prefers-reduced-motion — morph effect disabled`);
      if (morphLayerRef.current) {
        morphLayerRef.current.style.display = "none";
      }
      return () => window.removeEventListener("resize", checkDesktop);
    }

    console.log(
      `[${TAG}] 🎬 Morph scroll listener INITIALIZED — ` +
      `isDesktop: ${isDesktopRef.current}, reducedMotion: ${reducedMotionRef.current}, ` +
      `morphLayer: ${morphLayerRef.current ? "attached" : "NULL"}, ` +
      `hero: ${heroRef.current ? "attached" : "NULL"}, ` +
      `portfolio: ${portfolioRef.current ? "attached" : "NULL"}, ` +
      `firstCard: ${firstCardRef.current ? "attached" : "NULL"}`
    );

    function update() {
      const layer = morphLayerRef.current;
      if (!layer) {
        if (currentPhaseRef.current !== "none") {
          console.warn(`[${TAG}] ⚠️ morphLayer ref is NULL — morph cannot render`);
          currentPhaseRef.current = "none";
        }
        return;
      }
      if (!isDesktopRef.current) return;

      const hero = heroRef.current;
      const portfolio = portfolioRef.current;
      const firstCard = firstCardRef.current;

      if (!hero) {
        if (currentPhaseRef.current !== "none") {
          console.warn(`[${TAG}] ⚠️ Hero ref is NULL — morph paused`);
          currentPhaseRef.current = "none";
        }
        return;
      }

      const vh = window.innerHeight;
      const scrollY = window.scrollY;

      // Hero section bounds
      const heroTop = hero.offsetTop;
      const heroHeight = hero.offsetHeight;
      const heroBottom = heroTop + heroHeight;

      // Phase 1: Hero section — subtle scale-down
      if (scrollY < heroBottom) {
        if (currentPhaseRef.current !== "hero") {
          console.log(
            `[${TAG}] 📐 Phase → HERO — ` +
            `scrollY: ${Math.round(scrollY)}, heroBottom: ${Math.round(heroBottom)}, ` +
            `heroHeight: ${heroHeight}px`
          );
          currentPhaseRef.current = "hero";
        }

        const heroProgress = clamp(scrollY / heroHeight, 0, 1);
        const scale = 1 - heroProgress * 0.08;

        layer.style.setProperty("--morph-inset-top", "0px");
        layer.style.setProperty("--morph-inset-right", "0px");
        layer.style.setProperty("--morph-inset-bottom", "0px");
        layer.style.setProperty("--morph-inset-left", "0px");
        layer.style.setProperty("--morph-radius", "0px");
        layer.style.setProperty("--morph-opacity", "1");
        layer.style.setProperty("--morph-scale", String(scale));

        if (firstCard) {
          firstCard.style.setProperty("--first-card-opacity", "0");
        }
        return;
      }

      // Phase 2: Intermediate sections — layer persists, hidden behind opaque sections
      if (!portfolio) {
        if (currentPhaseRef.current !== "intermediate") {
          console.warn(
            `[${TAG}] ⚠️ Phase → INTERMEDIATE but portfolio ref is NULL — ` +
            `morph cannot calculate Phase 3. Is PortfolioTable mounted and registered?`
          );
          currentPhaseRef.current = "intermediate";
        }
        layer.style.setProperty("--morph-opacity", "1");
        layer.style.setProperty("--morph-scale", "0.92");
        return;
      }

      const portfolioRect = portfolio.getBoundingClientRect();
      const morphStartThreshold = vh * 0.7;

      if (portfolioRect.top > morphStartThreshold) {
        if (currentPhaseRef.current !== "intermediate") {
          console.log(
            `[${TAG}] 📐 Phase → INTERMEDIATE — ` +
            `portfolioRect.top: ${Math.round(portfolioRect.top)}, ` +
            `threshold: ${Math.round(morphStartThreshold)} (70% of ${vh}vh). ` +
            `Layer hidden behind opaque sections.`
          );
          currentPhaseRef.current = "intermediate";
        }

        layer.style.setProperty("--morph-inset-top", "0px");
        layer.style.setProperty("--morph-inset-right", "0px");
        layer.style.setProperty("--morph-inset-bottom", "0px");
        layer.style.setProperty("--morph-inset-left", "0px");
        layer.style.setProperty("--morph-radius", "0px");
        layer.style.setProperty("--morph-opacity", "1");
        layer.style.setProperty("--morph-scale", "0.92");

        if (firstCard) {
          firstCard.style.setProperty("--first-card-opacity", "0");
        }
        return;
      }

      // Phase 3: Portfolio arrival — morph to first card
      if (!firstCard) {
        if (currentPhaseRef.current !== "morph") {
          console.warn(
            `[${TAG}] ⚠️ Phase → MORPH but firstCard ref is NULL — ` +
            `cannot calculate morph target. Is the first StoryCard registered?`
          );
          currentPhaseRef.current = "morph";
        }
        layer.style.setProperty("--morph-opacity", "1");
        return;
      }

      if (currentPhaseRef.current !== "morph") {
        const cardRect = firstCard.getBoundingClientRect();
        console.log(
          `[${TAG}] 📐 Phase → MORPH — ` +
          `portfolioRect.top: ${Math.round(portfolioRect.top)}, ` +
          `firstCard rect: ${Math.round(cardRect.left)},${Math.round(cardRect.top)} ` +
          `${Math.round(cardRect.width)}x${Math.round(cardRect.height)}, ` +
          `viewport: ${window.innerWidth}x${vh}`
        );
        currentPhaseRef.current = "morph";
      }

      const cardRect = firstCard.getBoundingClientRect();

      // Progress: 0 when portfolio top hits 70% of vh, 1 when it hits 0
      const rawProgress = 1 - portfolioRect.top / morphStartThreshold;
      const progress = clamp(rawProgress, 0, 1);
      const eased = smoothstep(progress);

      // Interpolate clip-path inset from (0,0,0,0) to card's bounding rect
      const insetTop = eased * cardRect.top;
      const insetRight = eased * (window.innerWidth - cardRect.right);
      const insetBottom = eased * (vh - cardRect.bottom);
      const insetLeft = eased * cardRect.left;
      const radius = eased * 4;

      layer.style.setProperty("--morph-inset-top", `${insetTop}px`);
      layer.style.setProperty("--morph-inset-right", `${insetRight}px`);
      layer.style.setProperty("--morph-inset-bottom", `${insetBottom}px`);
      layer.style.setProperty("--morph-inset-left", `${insetLeft}px`);
      layer.style.setProperty("--morph-radius", `${radius}px`);
      layer.style.setProperty("--morph-scale", String(0.92 + eased * 0.08));

      // Cross-fade: morph layer fades out, first card fades in
      const fadeStart = 0.6;
      const fadeProgress = clamp((progress - fadeStart) / (1 - fadeStart), 0, 1);
      layer.style.setProperty("--morph-opacity", String(1 - fadeProgress));
      if (firstCard) {
        firstCard.style.setProperty(
          "--first-card-opacity",
          String(fadeProgress)
        );
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
