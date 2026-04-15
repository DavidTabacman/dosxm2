import { useEffect, useRef, useState } from "react";
import { useIntersectionObserver } from "../shared/useIntersectionObserver";
import { useScrollProgress } from "../shared/useScrollProgress";
import styles from "./PortfolioTable.module.css";

const STORIES = [
  {
    zona: "Chamberí",
    dias: 18,
    story: "La historia de un nuevo comienzo.",
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=1000&fit=crop",
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

function StoryCard({
  zona,
  dias,
  story,
  image,
  forceActive,
}: {
  zona: string;
  dias: number;
  story: string;
  image: string;
  forceActive?: boolean;
}) {
  const [ref, isIntersecting] = useIntersectionObserver({
    threshold: 0.6,
    rootMargin: "0px",
  });

  const isActive = forceActive || isIntersecting;

  return (
    <div
      className={`${styles.card} ${isActive ? styles.cardActive : ""}`}
      ref={ref}
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
  const progress = useScrollProgress(sectionRef);
  const [isDesktop, setIsDesktop] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const motionMql = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(motionMql.matches);

    const mql = window.matchMedia("(min-width: 769px)");
    setIsDesktop(mql.matches);
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  const useScrollJacking = isDesktop && !reducedMotion;

  // Calculate horizontal translate and active card index
  let translateX = 0;
  let activeCardIndex = -1;

  if (useScrollJacking && trackRef.current) {
    const track = trackRef.current;
    const viewportEl = track.parentElement;
    if (viewportEl) {
      const scrollableWidth = track.scrollWidth - viewportEl.clientWidth;
      // Map progress: horizontal scroll happens roughly in the middle range
      const adjustedProgress = Math.max(0, Math.min(1, (progress - 0.15) / 0.7));
      translateX = -adjustedProgress * scrollableWidth;

      // Determine which card is centered
      const cardWidth = track.scrollWidth / STORIES.length;
      const centerOffset = viewportEl.clientWidth / 2;
      const scrollPos = adjustedProgress * scrollableWidth;
      activeCardIndex = Math.round((scrollPos + centerOffset - cardWidth / 2) / cardWidth);
      activeCardIndex = Math.max(0, Math.min(STORIES.length - 1, activeCardIndex));
    }
  }

  return (
    <section
      className={`${styles.section} ${useScrollJacking ? styles.sectionDesktop : ""}`}
      ref={sectionRef}
    >
      <div className={useScrollJacking ? styles.stickyContainer : undefined}>
        <h2 className={styles.heading}>Historias Vendidas</h2>
        <div className={styles.trackViewport}>
          <div
            className={`${styles.track} ${useScrollJacking ? styles.trackDesktop : ""}`}
            ref={trackRef}
            style={useScrollJacking ? { transform: `translateX(${translateX}px)` } : undefined}
          >
            {STORIES.map((s, i) => (
              <StoryCard
                key={s.zona}
                zona={s.zona}
                dias={s.dias}
                story={s.story}
                image={s.image}
                forceActive={useScrollJacking ? i === activeCardIndex : undefined}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
