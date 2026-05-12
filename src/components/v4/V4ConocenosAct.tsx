import { useSectionReveal } from "../shared/useSectionReveal";
import type { Founder, FounderBio } from "@/constants/founders";
import styles from "./V4ConocenosAct.module.css";
import anim from "./v4-animations.module.css";

export type ActSide = "left" | "right";

export interface V4ConocenosActProps {
  /** URL fragment id + scroll-anchor id ("pablo" | "borja"). */
  id: string;
  /** Stable id for the `<h2>` so `aria-labelledby` resolves. */
  headingId: string;
  side: ActSide;
  founder: Founder;
  bio: FounderBio;
  /** First portrait gets `loading="eager"` + `fetchPriority="high"` for LCP. */
  isLcp?: boolean;
}

export default function V4ConocenosAct({
  id,
  headingId,
  side,
  founder,
  bio,
  isLcp = false,
}: V4ConocenosActProps) {
  const [revealRef, isRevealed] = useSectionReveal(0.15);

  return (
    <section
      id={id}
      ref={revealRef}
      aria-labelledby={headingId}
      className={`${styles.section} ${
        isRevealed ? styles.sectionRevealed : ""
      }`}
      data-side={side}
    >
      <div className={styles.layout}>
        <div className={styles.portraitColumn}>
          <div className={styles.portraitSticky}>
            <div
              className={`${styles.portraitOuter} ${
                side === "right" ? styles.portraitOuterAlt : ""
              }`}
            >
              <div className={styles.portraitFrame}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  className={styles.portrait}
                  src={founder.portraitUrl}
                  alt={founder.alt}
                  data-asset-type="founder-portrait"
                  loading={isLcp ? "eager" : "lazy"}
                  fetchPriority={isLcp ? "high" : "auto"}
                  decoding={isLcp ? "sync" : "async"}
                  onError={(e) => {
                    const img = e.currentTarget;
                    console.error(
                      `[V4-Conocenos] ❌ Portrait "${founder.name}" load FAILED — ` +
                        `src: ${img.src}. Reason: image URL unreachable or blocked.`
                    );
                    img.style.visibility = "hidden";
                  }}
                />
                <div className={styles.portraitTint} aria-hidden="true" />
              </div>
            </div>
          </div>
        </div>

        <div
          className={`${styles.copyColumn} ${anim.stagger} ${
            isRevealed ? anim.staggerVisible : ""
          }`}
        >
          <h2 id={headingId} className={styles.heading}>
            <span className={styles.headingIntro}>{bio.introLine}</span>
          </h2>
          <div className={styles.ruleAccent} aria-hidden="true" />
          {bio.paragraphs.map((p, i) => (
            <p key={i} className={styles.body}>
              {p}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
