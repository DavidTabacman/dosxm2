import { useIntersectionObserver } from "../shared/useIntersectionObserver";
import styles from "./PortfolioGrid.module.css";

function videoDebug(label: string) {
  return {
    onLoadStart: () => console.log(`[Video:${label}] 📡 loadstart`),
    onCanPlay: () => console.log(`[Video:${label}] ✅ canplay`),
    onPlay: () => console.log(`[Video:${label}] ▶️ play`),
    onPlaying: () => console.log(`[Video:${label}] 🎬 playing`),
    onStalled: () => console.log(`[Video:${label}] ⚠️ stalled`),
    onError: (e: React.SyntheticEvent<HTMLVideoElement>) => {
      const v = e.currentTarget;
      console.error(`[Video:${label}] ❌ ERROR — code: ${v.error?.code}, message: "${v.error?.message}", networkState: ${v.networkState}, src: ${v.src}`);
    },
  };
}

const PROPERTIES = [
  {
    id: 1,
    zona: "Chamberí",
    meta: "Vendido en 18 días — 100% precio",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop",
    video: "https://assets.mixkit.co/videos/1222/1222-720.mp4",
  },
  {
    id: 2,
    zona: "Salamanca",
    meta: "Vendido en 22 días — 105% precio",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop",
    video: "https://assets.mixkit.co/videos/3683/3683-720.mp4",
  },
  {
    id: 3,
    zona: "Retiro",
    meta: "Vendido en 31 días — 98% precio",
    image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&h=600&fit=crop",
    video: "https://assets.mixkit.co/videos/3747/3747-720.mp4",
  },
  {
    id: 4,
    zona: "Moncloa",
    meta: "Vendido en 14 días — 100% precio",
    image: "https://images.unsplash.com/photo-1600573472592-401b489a3cdc?w=800&h=600&fit=crop",
    video: "https://assets.mixkit.co/videos/3789/3789-720.mp4",
  },
  {
    id: 5,
    zona: "Chamartín",
    meta: "Vendido en 27 días — 102% precio",
    image: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&h=600&fit=crop",
    video: "https://assets.mixkit.co/videos/4815/4815-720.mp4",
  },
];

function PropertyCard({
  zona,
  meta,
  image,
  video,
}: {
  zona: string;
  meta: string;
  image: string;
  video: string;
}) {
  const [ref, isVisible] = useIntersectionObserver({ threshold: 0.4 });

  return (
    <div
      className={`${styles.card} ${isVisible ? styles.inView : ""}`}
      ref={ref}
    >
      <video
        className={styles.cardImage}
        src={video}
        poster={image}
        loop
        muted
        autoPlay
        playsInline
        data-asset-type="video"
        {...videoDebug(`V1-Portfolio-${zona}`)}
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
          <PropertyCard key={p.id} zona={p.zona} meta={p.meta} image={p.image} video={p.video} />
        ))}
      </div>
    </section>
  );
}
