import { useRef } from "react";
import { useIntersectionObserver } from "../shared/useIntersectionObserver";
import { useScrollProgress } from "../shared/useScrollProgress";
import styles from "./PruebaSocial.module.css";

const TESTIMONIALS = [
  {
    quote:
      "Vendieron nuestro piso en 2 semanas por más de lo que esperábamos. El trato fue impecable.",
    author: "María y Carlos, Retiro",
  },
  {
    quote:
      "Nos acompañaron en cada paso. Se nota que les importa de verdad.",
    author: "Lucía Fernández, Chamberí",
  },
  {
    quote:
      "Profesionalidad y cercanía. Una combinación difícil de encontrar.",
    author: "Javier Ruiz, Salamanca",
  },
];

function QuoteCard({
  quote,
  author,
  parallaxOffset,
}: {
  quote: string;
  author: string;
  parallaxOffset: number;
}) {
  const [ref, isVisible] = useIntersectionObserver({ threshold: 0.3 });

  return (
    <blockquote
      className={`${styles.quote} ${isVisible ? styles.inView : ""}`}
      ref={ref}
      style={{ transform: `translateY(${isVisible ? parallaxOffset : 30}px)` }}
    >
      <p className={styles.quoteText}>&ldquo;{quote}&rdquo;</p>
      <footer className={styles.quoteAuthor}>&mdash; {author}</footer>
    </blockquote>
  );
}

export default function PruebaSocial() {
  const sectionRef = useRef<HTMLElement>(null);
  const progress = useScrollProgress(sectionRef);

  return (
    <section className={styles.section} ref={sectionRef}>
      <div className={styles.sectionLabel}>Prueba Social</div>
      <h2 className={styles.heading}>Lo que dicen nuestros clientes.</h2>
      <div className={styles.quotes}>
        {TESTIMONIALS.map((t, i) => (
          <QuoteCard
            key={t.author}
            quote={t.quote}
            author={t.author}
            parallaxOffset={progress * -(i + 1) * 35}
          />
        ))}
      </div>
    </section>
  );
}
