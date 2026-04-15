import { useEffect, useState } from "react";
import { useIntersectionObserver } from "../shared/useIntersectionObserver";
import styles from "./ChatSection.module.css";

const AVATAR_1 = "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=80&h=80&fit=crop&crop=face";
const AVATAR_2 = "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face";

interface Message {
  text: string;
  side: "left" | "right";
  avatar: string;
}

const MESSAGES: Message[] = [
  {
    text: "No eres un número en una base de datos.",
    side: "left",
    avatar: AVATAR_1,
  },
  {
    text: "Hablas directamente con nosotros. Siempre.",
    side: "right",
    avatar: AVATAR_2,
  },
  {
    text: "Conocemos cada rincón de Madrid. Cada barrio. Cada calle.",
    side: "left",
    avatar: AVATAR_1,
  },
  {
    text: "Y tratamos tu casa como si fuera la nuestra. Porque así lo sentimos.",
    side: "right",
    avatar: AVATAR_2,
  },
];

const TYPING_DELAY = 800;
const REVEAL_DELAY = 1200;

function ChatBubble({
  message,
  index,
  sectionVisible,
}: {
  message: Message;
  index: number;
  sectionVisible: boolean;
}) {
  const [state, setState] = useState<"hidden" | "typing" | "visible">("hidden");

  useEffect(() => {
    if (!sectionVisible) return;

    const typingTimeout = setTimeout(
      () => setState("typing"),
      index * REVEAL_DELAY
    );
    const visibleTimeout = setTimeout(
      () => setState("visible"),
      index * REVEAL_DELAY + TYPING_DELAY
    );

    return () => {
      clearTimeout(typingTimeout);
      clearTimeout(visibleTimeout);
    };
  }, [sectionVisible, index]);

  if (state === "hidden") return null;

  const isRight = message.side === "right";
  const rowClass = isRight ? styles.bubbleRowRight : styles.bubbleRow;
  const bubbleClass = isRight ? styles.bubbleRight : styles.bubble;

  return (
    <div className={`${rowClass} ${state === "visible" ? styles.visible : ""}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className={styles.avatar}
        src={message.avatar}
        alt={isRight ? "Fundador 2" : "Fundador 1"}
        data-asset-type="portrait"
      />
      {state === "typing" ? (
        <div className={styles.typing} aria-label="Escribiendo...">
          <span className={styles.typingDot} />
          <span className={styles.typingDot} />
          <span className={styles.typingDot} />
        </div>
      ) : (
        <div className={bubbleClass}>{message.text}</div>
      )}
    </div>
  );
}

export default function ChatSection() {
  const [ref, isVisible] = useIntersectionObserver({ threshold: 0.2 });

  return (
    <section className={styles.section} ref={ref}>
      <div className={styles.sectionLabel}>El Diferencial</div>
      <h2 className={styles.heading}>Una conversación, no un formulario.</h2>

      {MESSAGES.map((msg, i) => (
        <ChatBubble
          key={i}
          message={msg}
          index={i}
          sectionVisible={isVisible}
        />
      ))}
    </section>
  );
}
