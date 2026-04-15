import { useEffect, useRef, useState } from "react";
import { useIntersectionObserver } from "../shared/useIntersectionObserver";
import styles from "./TestimoniosChat.module.css";

const TESTIMONIALS = [
  {
    text: "¡Chicos, sois los mejores! Gracias por todo el esfuerzo.",
    sender: "Ana, Malasaña",
    side: "left" as const,
    time: "14:32",
  },
  {
    text: "Nos habéis cambiado la vida. Vendisteis nuestro piso en tiempo récord.",
    sender: "Pedro y Lucía, Chamberí",
    side: "right" as const,
    time: "16:45",
  },
  {
    text: "Profesionales de verdad. 100% recomendados.",
    sender: "Javier, Salamanca",
    side: "left" as const,
    time: "10:15",
  },
];

const TYPING_DELAY = 800;

function ChatBubble({
  text,
  sender,
  side,
  time,
  index,
  sectionVisible,
}: {
  text: string;
  sender: string;
  side: "left" | "right";
  time: string;
  index: number;
  sectionVisible: boolean;
}) {
  const [state, setState] = useState<"hidden" | "typing" | "visible">("hidden");
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!sectionVisible || hasAnimated.current) return;
    hasAnimated.current = true;

    const typingTimeout = setTimeout(
      () => setState("typing"),
      index * 1200
    );
    const visibleTimeout = setTimeout(
      () => setState("visible"),
      index * 1200 + TYPING_DELAY
    );

    return () => {
      clearTimeout(typingTimeout);
      clearTimeout(visibleTimeout);
    };
  }, [sectionVisible, index]);

  if (state === "hidden") return null;

  const slideClass = side === "right" ? styles.slideRight : styles.slideLeft;

  return (
    <div
      className={`${styles.row} ${side === "right" ? styles.rowRight : ""} ${slideClass} ${styles.inView}`}
    >
      {state === "typing" ? (
        <div className={styles.typing} aria-label="Escribiendo...">
          <span className={styles.typingDot} />
          <span className={styles.typingDot} />
          <span className={styles.typingDot} />
        </div>
      ) : (
        <div className={styles.bubble}>
          <div className={styles.senderName}>{sender}</div>
          <p className={styles.messageText}>{text}</p>
          <span className={styles.time}>{time}</span>
        </div>
      )}
    </div>
  );
}

export default function TestimoniosChat() {
  const [ref, isVisible] = useIntersectionObserver({ threshold: 0.2 });

  return (
    <section className={styles.section} ref={ref}>
      <div className={styles.sectionLabel}>Prueba Social</div>
      <h2 className={styles.heading}>Lo que nos dicen nuestros clientes.</h2>
      <div className={styles.chat}>
        {TESTIMONIALS.map((t, i) => (
          <ChatBubble
            key={t.sender}
            text={t.text}
            sender={t.sender}
            side={t.side}
            time={t.time}
            index={i}
            sectionVisible={isVisible}
          />
        ))}
      </div>
    </section>
  );
}
