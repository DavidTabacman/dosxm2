import { useEffect, useState } from "react";
import { useSectionReveal } from "../shared/useSectionReveal";
import { useSectionVisible } from "../shared/useSectionVisible";
import { RESENAS, type ResenaItem } from "./resenasData";
import styles from "./V4Resenas.module.css";
import anim from "./v4-animations.module.css";

const TYPING_MS = 800;
const STAGGER_MS = 1200;

type BubbleState = "hidden" | "typing" | "visible";

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function ReviewBubble({
  review,
  index,
}: {
  review: ResenaItem;
  index: number;
}) {
  // Reduced motion users see the final bubble immediately — no typing
  // cascade, no staggered delay. JS-driven animations (setTimeout) don't
  // get the free respect that CSS @media (prefers-reduced-motion) gives,
  // so we skip them explicitly.
  const [state, setState] = useState<BubbleState>(() =>
    prefersReducedMotion() ? "visible" : "hidden"
  );

  useEffect(() => {
    if (prefersReducedMotion()) return;

    console.log(
      `[V4-Resenas] 🎬 Bubble #${index} "${review.sender}" — ` +
        `typing @${index * STAGGER_MS}ms, visible @${index * STAGGER_MS + TYPING_MS}ms`
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
    // sender included for diagnostics consistency; index drives timing.
  }, [index, review.sender]);

  if (state === "hidden") {
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

/**
 * Placeholder row rendered while the section is out of view. Preserves
 * the chat's vertical rhythm so re-entering doesn't cause a layout jump.
 */
function ChatPlaceholderRow({ side }: { side: ResenaItem["side"] }) {
  return (
    <div
      className={`${styles.row} ${side === "right" ? styles.rowRight : ""}`}
      aria-hidden="true"
    />
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
  /* Header entrance animation is fire-once — the title should not
     replay on every re-entry, only the chat typing does. */
  const [headerRef, isHeaderRevealed] = useSectionReveal(0.2);

  /* Chat replay uses a repeatable hook — BRD 4.5 wants the typing
     cascade to play every time the user scrolls in. */
  const [chatRef, isChatVisible] = useSectionVisible(
    0.2,
    "0px 0px -5% 0px"
  );

  /* The conditional render (ReviewBubble when visible, ChatPlaceholderRow
     when not) handles reset for free: leaving the viewport unmounts the
     bubbles, re-entering mounts new ones with fresh state + fresh timers.
     No cycle counter, no manual state reset — React's unmount/mount does
     the work. */

  return (
    <section
      id={id}
      className={styles.section}
      aria-labelledby="v4-resenas-heading"
    >
      <div
        ref={headerRef}
        className={`${styles.sectionHeader} ${anim.revealTarget} ${
          isHeaderRevealed ? anim.revealTargetVisible : ""
        }`}
      >
        <h2 id="v4-resenas-heading" className={styles.heading}>
          Lo que dicen{" "}
          <span className={styles.headingAccent}>nuestros clientes.</span>
        </h2>
        <p className={styles.sub}>
          Reseñas reales de personas a quienes acompañamos desde la primera
          visita hasta la firma.
        </p>
      </div>

      <div
        ref={chatRef}
        className={styles.chat}
        role="log"
        aria-live="polite"
        aria-label="Reseñas de clientes de DOSXM2"
      >
        {items.map((review, index) =>
          isChatVisible ? (
            <ReviewBubble
              key={review.id}
              review={review}
              index={index}
            />
          ) : (
            <ChatPlaceholderRow key={review.id} side={review.side} />
          )
        )}
      </div>
    </section>
  );
}
