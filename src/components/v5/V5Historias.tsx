import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { useSectionReveal } from "../shared/useSectionReveal";
import { HISTORIAS, type HistoriaItem } from "./historiasData";
import styles from "./V5Historias.module.css";
import anim from "./v5-animations.module.css";

type FlipState = "none" | "flipped" | "unflipping";

function FlipCard({ item }: { item: HistoriaItem }) {
  const [flipState, setFlipState] = useState<FlipState>("none");
  const isFlipped = flipState === "flipped";

  function handleFlip() {
    setFlipState((prev) => {
      const next = prev === "flipped" ? "unflipping" : "flipped";
      console.log(
        `[V5-Historias] 🔄 Card "${item.title}" — ${prev} → ${next}`
      );
      return next;
    });
  }

  function handleAnimationEnd() {
    if (flipState === "unflipping") {
      setFlipState("none");
    }
  }

  const flipClass =
    flipState === "flipped"
      ? styles.flipped
      : flipState === "unflipping"
        ? styles.unflipping
        : "";

  return (
    <div
      className={`${styles.card} ${flipClass}`}
      onClick={handleFlip}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleFlip();
        }
      }}
      role="button"
      tabIndex={0}
      aria-pressed={isFlipped}
      aria-label={`${item.title} — ${isFlipped ? "Volver a la foto" : "Ver historia"}`}
    >
      <div className={styles.cardInner} onAnimationEnd={handleAnimationEnd}>
        <div className={styles.cardFront}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className={styles.cardImage}
            src={item.imageUrl}
            alt={item.alt}
            data-asset-type="property-story"
            loading="lazy"
            onError={(e) => {
              const img = e.currentTarget;
              console.error(
                `[V5-Historias] ❌ Image load FAILED for "${item.title}" — ` +
                  `src: ${img.src}. Reason: image URL unreachable, CORS blocked, or rate-limited.`
              );
              img.style.visibility = "hidden";
            }}
          />
          <div className={styles.cardFrontOverlay}>
            <span className={styles.cardZona}>{item.zona}</span>
            <h3 className={styles.cardTitle}>{item.title}</h3>
            <span className={styles.cardHint}>Toca para ver la historia</span>
          </div>
        </div>
        <div className={styles.cardBack}>
          <div className={styles.backBody}>
            <div className={styles.backTopLabel}>{item.zona}</div>
            <h3 className={styles.backTitle}>{item.title}</h3>
            <p className={styles.backStory}>{item.story}</p>
          </div>
          {item.outcome ? (
            <div className={styles.backOutcome}>{item.outcome}</div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export interface V5HistoriasProps {
  id?: string;
  items?: ReadonlyArray<HistoriaItem>;
}

export default function V5Historias({
  id = "historias",
  items = HISTORIAS,
}: V5HistoriasProps) {
  const [ref, isRevealed] = useSectionReveal(0.15);

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    slidesToScroll: 1,
    align: "start",
    watchDrag: false,
    breakpoints: {
      "(prefers-reduced-motion: reduce)": { duration: 0 },
    },
  });

  const [canScroll, setCanScroll] = useState(false);

  useEffect(() => {
    if (!emblaApi) return;
    const update = () => setCanScroll(emblaApi.scrollSnapList().length > 1);
    update();
    emblaApi.on("reInit", update);
    return () => {
      emblaApi.off("reInit", update);
    };
  }, [emblaApi]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  return (
    <section
      id={id}
      className={styles.section}
      aria-labelledby="v4-historias-heading"
    >
      <div
        ref={ref}
        className={`${styles.sectionHeader} ${anim.revealTarget} ${
          isRevealed ? anim.revealTargetVisible : ""
        }`}
      >
        <h2 id="v4-historias-heading" className={styles.heading}>
          Llegaste tarde...{" "}
          <span className={styles.headingAccent}>¡Ya se han vendido!</span>
        </h2>
        <p className={styles.sub}>
          Echa un vistazo a nuestras últimas propiedades vendidas y descubre la
          historia detrás de cada una, haciendo clic sobre ellas.
        </p>
      </div>

      <div className={styles.carousel}>
        <button
          type="button"
          className={styles.arrow}
          onClick={scrollPrev}
          aria-label="Propiedad anterior"
          disabled={!canScroll}
        >
          <span aria-hidden="true">‹</span>
        </button>
        <div
          className={styles.viewport}
          ref={emblaRef}
          aria-roledescription="carousel"
          aria-label="Propiedades vendidas"
        >
          <ul className={styles.container}>
            {items.map((item, i) => (
              <li
                key={item.id}
                className={styles.slide}
                role="group"
                aria-roledescription="slide"
                aria-label={`${i + 1} de ${items.length}`}
              >
                <FlipCard item={item} />
              </li>
            ))}
          </ul>
        </div>
        <button
          type="button"
          className={styles.arrow}
          onClick={scrollNext}
          aria-label="Siguiente propiedad"
          disabled={!canScroll}
        >
          <span aria-hidden="true">›</span>
        </button>
      </div>
    </section>
  );
}
