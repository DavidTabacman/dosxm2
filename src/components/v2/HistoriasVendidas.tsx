import { useState } from "react";
import { useIntersectionObserver } from "../shared/useIntersectionObserver";
import styles from "./HistoriasVendidas.module.css";

const PROPERTIES = [
  {
    zona: "Malasaña",
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=1000&fit=crop",
    aspect: "3/4" as const,
    story:
      "Ana necesitaba vender rápido para mudarse a Londres. Lo logramos en 18 días sin bajar el precio.",
  },
  {
    zona: "Lavapiés",
    image:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop",
    aspect: "4/3" as const,
    story:
      "Una reforma integral y el doble de valor. Así de simple.",
  },
  {
    zona: "Chamberí",
    image:
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&h=1000&fit=crop",
    aspect: "3/4" as const,
    story:
      "El nuevo comienzo de una familia. Vendido en 18 días por encima del precio pedido.",
  },
  {
    zona: "Salamanca",
    image:
      "https://images.unsplash.com/photo-1600573472592-401b489a3cdc?w=800&h=600&fit=crop",
    aspect: "4/3" as const,
    story:
      "Un piso señorial que encontró a su comprador perfecto en menos de un mes.",
  },
  {
    zona: "Retiro",
    image:
      "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&h=1000&fit=crop",
    aspect: "3/4" as const,
    story:
      "Vendimos por un 5% más de lo que el propietario esperaba. Así trabajamos.",
  },
];

function FlipCard({
  zona,
  image,
  aspect,
  story,
}: {
  zona: string;
  image: string;
  aspect: string;
  story: string;
}) {
  const [flipped, setFlipped] = useState(false);
  const [ref, isVisible] = useIntersectionObserver({ threshold: 0.2 });

  return (
    <div
      className={`${styles.card} ${flipped ? styles.flipped : ""} ${isVisible ? styles.inView : ""}`}
      ref={ref}
      onClick={() => setFlipped(!flipped)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          setFlipped(!flipped);
        }
      }}
      role="button"
      tabIndex={0}
      aria-label={`${zona} — ${flipped ? "Volver a la foto" : "Ver historia"}`}
    >
      <div className={styles.cardInner} style={{ aspectRatio: aspect }}>
        <div className={styles.cardFront}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className={styles.cardImage}
            src={image}
            alt={`Propiedad en ${zona}`}
            data-asset-type="property-lifestyle"
            loading="lazy"
          />
          <div className={styles.cardFrontOverlay}>
            <span className={styles.zona}>{zona}</span>
            <span className={styles.tapHint}>Toca para ver la historia</span>
          </div>
        </div>
        <div className={styles.cardBack}>
          <p className={styles.story}>{story}</p>
          <span className={styles.backZona}>{zona}</span>
        </div>
      </div>
    </div>
  );
}

export default function HistoriasVendidas() {
  return (
    <section className={styles.section}>
      <div className={styles.sectionLabel}>Historias Vendidas</div>
      <h2 className={styles.heading}>Cada casa tiene su historia.</h2>
      <div className={styles.grid}>
        {PROPERTIES.map((p) => (
          <FlipCard
            key={p.zona}
            zona={p.zona}
            image={p.image}
            aspect={p.aspect}
            story={p.story}
          />
        ))}
      </div>
    </section>
  );
}
