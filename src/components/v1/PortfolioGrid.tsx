import { useIntersectionObserver } from "../shared/useIntersectionObserver";
import styles from "./PortfolioGrid.module.css";

const PROPERTIES = [
  {
    id: 1,
    zona: "Chamberí",
    meta: "Vendido en 18 días — 100% precio",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop",
  },
  {
    id: 2,
    zona: "Salamanca",
    meta: "Vendido en 22 días — 105% precio",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop",
  },
  {
    id: 3,
    zona: "Retiro",
    meta: "Vendido en 31 días — 98% precio",
    image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&h=600&fit=crop",
  },
  {
    id: 4,
    zona: "Moncloa",
    meta: "Vendido en 14 días — 100% precio",
    image: "https://images.unsplash.com/photo-1600573472592-401b489a3cdc?w=800&h=600&fit=crop",
  },
  {
    id: 5,
    zona: "Chamartín",
    meta: "Vendido en 27 días — 102% precio",
    image: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&h=600&fit=crop",
  },
];

function PropertyCard({
  zona,
  meta,
  image,
}: {
  zona: string;
  meta: string;
  image: string;
}) {
  const [ref, isVisible] = useIntersectionObserver({ threshold: 0.4 });

  return (
    <div
      className={`${styles.card} ${isVisible ? styles.inView : ""}`}
      ref={ref}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className={styles.cardImage}
        src={image}
        alt={`Propiedad en ${zona}`}
        data-asset-type="video"
        loading="lazy"
      />
      <span className={styles.videoLabel} aria-hidden="true">
        Video Tour
      </span>
      <div className={styles.cardOverlay}>
        <p className={styles.cardZona}>{zona}</p>
        <p className={styles.cardMeta}>{meta}</p>
      </div>
    </div>
  );
}

export default function PortfolioGrid() {
  return (
    <section className={styles.section}>
      <div className={styles.sectionLabel}>Nuestro Portfolio</div>
      <h2 className={styles.heading}>Historias Vendidas</h2>
      <div className={styles.grid}>
        {PROPERTIES.map((p) => (
          <PropertyCard key={p.id} zona={p.zona} meta={p.meta} image={p.image} />
        ))}
      </div>
    </section>
  );
}
