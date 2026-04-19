import { useEffect, useRef, useState } from "react";
import { useSectionReveal } from "../shared/useSectionReveal";
import { RESENAS, type ResenaItem } from "./resenasData";
import styles from "./V4Resenas.module.css";
import anim from "./v4-animations.module.css";

const TYPING_MS = 800;
const STAGGER_MS = 1200;

function ReviewBubble({
  review,
  index,
  sectionVisible,
}: {
  review: ResenaItem;
  index: number;
  sectionVisible: boolean;
}) {
  type State = "hidden" | "typing" | "visible";
  const [state, setState] = useState<State>("hidden");
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!sectionVisible || hasAnimated.current) return;
    hasAnimated.current = true;
    console.log(
      `[V4-Resenas] 🎬 Bubble #${index} "${review.sender}" — typing @${index * STAGGER_MS}ms, visible @${index * STAGGER_MS + TYPING_MS}ms`
    );

    const typingTimeout = setTimeout(() => {
      setState("typing");
    }, index * STAGGER_MS);
    const visibleTimeout = setTimeout(() => {
      setState("visible");
    }, index * STAGGER_MS + TYPING_MS);

    return () => {
      clearTimeout(typingTimeout);
      clearTimeout(visibleTimeout);
    };
  }, [sectionVisible, index, review.sender]);

  if (state === "hidden") {
    // Placeholder keeps chat height stable, so bubbles reveal without page shift.
    return (
      <div
        className={`${styles.row} ${review.side === "right" ? styles.rowRight : ""}`}
        aria-hidden="true"
      />
    );
  }

  const slideClass =
    review.side === "right" ? styles.slideRight : styles.slideLeft;

  return (
    <div
      className={`${styles.row} ${review.side === "right" ? styles.rowRight : ""} ${slideClass} ${styles.inView}`}
    >
      {state === "typing" ? (
        <div className={styles.typing} aria-label="Escribiendo…">
          <span className={styles.typingDot} />
          <span className={styles.typingDot} />
          <span className={styles.typingDot} />
        </div>
      ) : (
        <div className={styles.bubble}>
          <div>
            <span className={styles.senderName}>{review.sender}</span>
            <span className={styles.location}>{review.location}</span>
          </div>
          <p className={styles.message}>{review.text}</p>
          <span className={styles.time}>{review.time}</span>
        </div>
      )}
    </div>
  );
}

export interface V4ResenasProps {
  id?: string;
  items?: ReadonlyArray<ResenaItem>;
}

export default function V4Resenas({
  id = "resenas",
  items = RESENAS,
}: V4ResenasProps) {
  const [ref, isVisible] = useSectionReveal(0.2);

  return (
    <section
      id={id}
      className={styles.section}
      ref={ref}
      aria-labelledby="v4-resenas-heading"
    >
      <div
        className={`${styles.sectionHeader} ${anim.revealTarget} ${
          isVisible ? anim.revealTargetVisible : ""
        }`}
      >
        <div className={styles.eyebrow}>Prueba Social</div>
        <h2 id="v4-resenas-heading" className={styles.heading}>
          Lo que dicen{" "}
          <span className={styles.headingAccent}>nuestros clientes.</span>
        </h2>
        <p className={styles.sub}>
          Reseñas reales de personas a quienes acompañamos desde la primera
          visita hasta la firma.
        </p>
      </div>

      <div className={styles.chat}>
        {items.map((review, index) => (
          <ReviewBubble
            key={review.id}
            review={review}
            index={index}
            sectionVisible={isVisible}
          />
        ))}
      </div>
    </section>
  );
}
