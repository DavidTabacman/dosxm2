import { useIntersectionObserver } from "../shared/useIntersectionObserver";
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

function QuoteCard({ quote, author }: { quote: string; author: string }) {
  const [ref, isVisible] = useIntersectionObserver({ threshold: 0.3 });

  return (
    <blockquote
      className={`${styles.quote} ${isVisible ? styles.inView : ""}`}
      ref={ref}
    >
      <p className={styles.quoteText}>&ldquo;{quote}&rdquo;</p>
      <footer className={styles.quoteAuthor}>&mdash; {author}</footer>
    </blockquote>
  );
}

export default function PruebaSocial() {
  return (
    <section className={styles.section}>
      <div className={styles.sectionLabel}>Prueba Social</div>
      <h2 className={styles.heading}>Lo que dicen nuestros clientes.</h2>
      <div className={styles.quotes}>
        {TESTIMONIALS.map((t) => (
          <QuoteCard key={t.author} quote={t.quote} author={t.author} />
        ))}
      </div>
    </section>
  );
}
