import { useCallback, useState } from "react";
import styles from "./PortfolioTable.module.css";

const PROPERTIES = [
  {
    id: "CHMB-01",
    zona: "Chamberí",
    tiempo: "18 Días",
    resultado: "Vendido 100% Precio",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=640&h=440&fit=crop",
  },
  {
    id: "SLMC-02",
    zona: "Salamanca",
    tiempo: "22 Días",
    resultado: "Vendido 105% Precio",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=640&h=440&fit=crop",
  },
  {
    id: "RTRO-03",
    zona: "Retiro",
    tiempo: "31 Días",
    resultado: "Vendido 98% Precio",
    image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=640&h=440&fit=crop",
  },
  {
    id: "MNCL-04",
    zona: "Moncloa",
    tiempo: "14 Días",
    resultado: "Vendido 100% Precio",
    image: "https://images.unsplash.com/photo-1600573472592-401b489a3cdc?w=640&h=440&fit=crop",
  },
  {
    id: "CHMT-05",
    zona: "Chamartín",
    tiempo: "27 Días",
    resultado: "Vendido 102% Precio",
    image: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=640&h=440&fit=crop",
  },
];

export default function PortfolioTable() {
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  }, []);

  const hoveredProperty = PROPERTIES.find((p) => p.id === hoveredRow);

  return (
    <section className={styles.section}>
      <div className={styles.sectionLabel}>[PANEL: HISTORIAS VENDIDAS]</div>
      <h2 className={styles.heading}>Propiedades Vendidas</h2>

      {/* Desktop: table with hover image */}
      <div className={styles.desktopTable} onMouseMove={handleMouseMove}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID_PROPIEDAD</th>
              <th>ZONA</th>
              <th>TIEMPO_MERCADO</th>
              <th>RESULTADO</th>
            </tr>
          </thead>
          <tbody>
            {PROPERTIES.map((p) => (
              <tr
                key={p.id}
                className={styles.tableRow}
                onMouseEnter={() => setHoveredRow(p.id)}
                onMouseLeave={() => setHoveredRow(null)}
              >
                <td>{p.id}</td>
                <td>{p.zona}</td>
                <td>{p.tiempo}</td>
                <td className={styles.resultado}>{p.resultado}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {hoveredProperty && (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            className={`${styles.hoverImage} ${hoveredRow ? styles.visible : ""}`}
            src={hoveredProperty.image}
            alt={`Propiedad en ${hoveredProperty.zona}`}
            data-asset-type="property-photo"
            style={{ left: mousePos.x, top: mousePos.y }}
          />
        )}
      </div>

      {/* Mobile: accordion */}
      <div className={styles.mobileList}>
        {PROPERTIES.map((p) => (
          <details key={p.id} className={styles.accordionItem}>
            <summary className={styles.accordionSummary}>
              <span>{p.id} — {p.zona}</span>
            </summary>
            <div className={styles.accordionContent}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className={styles.accordionImage}
                src={p.image}
                alt={`Propiedad en ${p.zona}`}
                data-asset-type="property-photo"
                loading="lazy"
              />
              <dl className={styles.accordionData}>
                <dt>Zona</dt>
                <dd>{p.zona}</dd>
                <dt>Tiempo</dt>
                <dd>{p.tiempo}</dd>
                <dt>Resultado</dt>
                <dd>{p.resultado}</dd>
              </dl>
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
