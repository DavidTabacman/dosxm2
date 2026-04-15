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

function ChatBubble({
  text,
  sender,
  side,
  time,
}: {
  text: string;
  sender: string;
  side: "left" | "right";
  time: string;
}) {
  const [ref, isVisible] = useIntersectionObserver({ threshold: 0.3 });

  const slideClass = side === "right" ? styles.slideRight : styles.slideLeft;

  return (
    <div
      className={`${styles.row} ${side === "right" ? styles.rowRight : ""} ${slideClass} ${isVisible ? styles.inView : ""}`}
      ref={ref}
    >
      <div className={styles.bubble}>
        <div className={styles.senderName}>{sender}</div>
        <p className={styles.messageText}>{text}</p>
        <span className={styles.time}>{time}</span>
      </div>
    </div>
  );
}

export default function TestimoniosChat() {
  return (
    <section className={styles.section}>
      <div className={styles.sectionLabel}>Prueba Social</div>
      <h2 className={styles.heading}>Lo que nos dicen nuestros clientes.</h2>
      <div className={styles.chat}>
        {TESTIMONIALS.map((t) => (
          <ChatBubble
            key={t.sender}
            text={t.text}
            sender={t.sender}
            side={t.side}
            time={t.time}
          />
        ))}
      </div>
    </section>
  );
}
