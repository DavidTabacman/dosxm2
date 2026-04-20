import { useSectionReveal } from "../shared/useSectionReveal";
import styles from "./V4Diferencial.module.css";
import anim from "./v4-animations.module.css";

export interface Founder {
  name: string;
  portraitUrl: string;
  alt: string;
}

export interface V4DiferencialProps {
  id?: string;
  founderA: Founder;
  founderB: Founder;
  /**
   * When true, the portrait block fades out — the page-level
   * `useScrollPastAnchor` has detected the section is off-screen,
   * and the floating WhatsApp FAB is arriving at the bottom-right.
   * This sells the "portraits detached" narrative per BRD 4.2.
   */
  portraitsDetached?: boolean;
}

export default function V4Diferencial({
  id = "diferencial",
  founderA,
  founderB,
  portraitsDetached = false,
}: V4DiferencialProps) {
  const [ref, isRevealed] = useSectionReveal(0.15);

  return (
    <section
      id={id}
      className={styles.section}
      ref={ref}
      aria-labelledby="v4-diferencial-heading"
    >
      <div className={styles.grid}>
        <div
          className={`${styles.copyBlock} ${anim.stagger} ${
            isRevealed ? anim.staggerVisible : ""
          }`}
        >
          <h2 id="v4-diferencial-heading" className={styles.heading}>
            Dos visiones,{" "}
            <span className={styles.headingAccent}>un único objetivo.</span>
          </h2>
          <p className={styles.lede}>
            En un sector donde la mayoría trabaja solo, nosotros somos un
            equipo.
          </p>
          <div className={styles.ruleAccent} aria-hidden="true" />
          <p className={styles.body}>
            Doble compromiso, trato personal y resultados demostrables. Nos
            dedicamos a menos propiedades para acompañarte a ti, no a una
            cartera. Cada casa tiene su historia — y nosotros nos sentamos
            contigo hasta que la tuya esté contada.
          </p>
          <p className={styles.body}>
            Tu tranquilidad es nuestra métrica principal.
          </p>
          <span className={styles.signature}>
            <span className={styles.signatureRule} aria-hidden="true" />
            <span>{founderA.name} &amp; {founderB.name}</span>
          </span>
        </div>

        <div
          className={`${styles.portraits} ${anim.revealTarget} ${
            isRevealed ? anim.revealTargetVisible : ""
          } ${portraitsDetached ? styles.portraitsDetached : ""}`}
          data-detached={portraitsDetached ? "true" : "false"}
        >
          {[founderA, founderB].map((founder) => (
            <div key={founder.name} className={styles.portraitFrame}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className={styles.portrait}
                src={founder.portraitUrl}
                alt={founder.alt}
                data-asset-type="founder-portrait"
                loading="lazy"
                onError={(e) => {
                  const img = e.currentTarget;
                  console.error(
                    `[V4-Diferencial] ❌ Portrait "${founder.name}" load FAILED — ` +
                      `src: ${img.src}. Reason: image URL unreachable or blocked.`
                  );
                  img.style.visibility = "hidden";
                }}
              />
              <span className={styles.portraitName}>{founder.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
