import { useState } from "react";
import { useSectionReveal } from "../shared/useSectionReveal";
import { HISTORIAS, type HistoriaItem } from "./historiasData";
import styles from "./V4Historias.module.css";
import anim from "./v4-animations.module.css";

type FlipState = "none" | "flipped" | "unflipping";

function FlipCard({ item }: { item: HistoriaItem }) {
  const [flipState, setFlipState] = useState<FlipState>("none");
  const isFlipped = flipState === "flipped";

  function handleFlip() {
    setFlipState((prev) => {
      const next = prev === "flipped" ? "unflipping" : "flipped";
      console.log(
        `[V4-Historias] 🔄 Card "${item.title}" — ${prev} → ${next}`
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
                `[V4-Historias] ❌ Image load FAILED for "${item.title}" — ` +
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
          <div>
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

export interface V4HistoriasProps {
  id?: string;
  items?: ReadonlyArray<HistoriaItem>;
}

export default function V4Historias({
  id = "historias",
  items = HISTORIAS,
}: V4HistoriasProps) {
  const [ref, isRevealed] = useSectionReveal(0.15);

  return (
    <section
      id={id}
      className={styles.section}
      ref={ref}
      aria-labelledby="v4-historias-heading"
    >
      <div
        className={`${styles.sectionHeader} ${anim.revealTarget} ${
          isRevealed ? anim.revealTargetVisible : ""
        }`}
      >
        <div className={styles.eyebrow}>Historias Vendidas</div>
        <h2 id="v4-historias-heading" className={styles.heading}>
          Cada casa tiene{" "}
          <span className={styles.headingAccent}>su historia.</span>
        </h2>
        <p className={styles.sub}>
          Toca una tarjeta para leer cómo acompañamos a cada familia desde la
          decisión de vender hasta la firma en notaría.
        </p>
      </div>

      <div className={styles.grid}>
        {items.map((item) => (
          <FlipCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}
