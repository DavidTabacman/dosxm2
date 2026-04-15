import { useIntersectionObserver } from "../shared/useIntersectionObserver";
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
}: {
  zona: string;
  dias: number;
  story: string;
  image: string;
}) {
  const [ref, isActive] = useIntersectionObserver({
    threshold: 0.6,
    rootMargin: "0px",
  });

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
  return (
    <section className={styles.section}>
      <h2 className={styles.heading}>Historias Vendidas</h2>
      <div className={styles.track}>
        {STORIES.map((s) => (
          <StoryCard
            key={s.zona}
            zona={s.zona}
            dias={s.dias}
            story={s.story}
            image={s.image}
          />
        ))}
      </div>
    </section>
  );
}
