import { useEffect } from "react";
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

  /* ============================================================
     TEMP DIAGNOSTIC — remove once the breath effect is confirmed
     working on the live site. Runs once on mount, dumps the full
     state of the portrait DOM + CSS + Web Animations, then samples
     computed `transform` every 1s for 10 ticks to prove (or
     disprove) that the animation is actually progressing.
     ============================================================ */
  useEffect(() => {
    const TAG = "[V4-Diferencial Breath DIAG]";
    const log = (label: string, ...rest: unknown[]) =>
      console.log(`${TAG} ${label}`, ...rest);

    log("== mount: starting diagnostic ==");
    log("UA:", navigator.userAgent);
    log("viewport:", window.innerWidth, "x", window.innerHeight);
    log(
      "viewport <= 600 (mobile breakpoint active):",
      window.innerWidth <= 600
    );
    log(
      "prefers-reduced-motion matches:",
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
    log(
      "CSS.supports animation-timeline view():",
      typeof CSS !== "undefined" && CSS.supports
        ? CSS.supports("animation-timeline: view()")
        : "CSS.supports unavailable"
    );
    log("CSS module styles.portraitBreath =", styles.portraitBreath);
    log("CSS module styles.portrait       =", styles.portrait);
    log("CSS module styles.portraitFrame  =", styles.portraitFrame);

    const wrappers = document.querySelectorAll(
      `.${styles.portraitBreath}`
    ) as NodeListOf<HTMLElement>;
    const wrappersByAttr = document.querySelectorAll(
      "[class*='portraitBreath']"
    );
    log(
      `wrappers via styles class (${styles.portraitBreath}):`,
      wrappers.length
    );
    log(
      "wrappers via [class*='portraitBreath']:",
      wrappersByAttr.length
    );

    if (wrappers.length === 0) {
      log(
        "❌ FAIL: no .portraitBreath elements matched the hashed class. " +
          "Either the JSX wrapper is missing, the className didn't resolve, " +
          "or the CSS module hash drifted between bundle and runtime."
      );
      return;
    }

    wrappers.forEach((el, i) => {
      const cs = window.getComputedStyle(el);
      log(`--- wrapper #${i + 1} (${el.className}) ---`);
      log(`  offset size: ${el.offsetWidth} x ${el.offsetHeight}`);
      log(`  animation-name:           ${cs.animationName}`);
      log(`  animation-duration:       ${cs.animationDuration}`);
      log(`  animation-delay:          ${cs.animationDelay}`);
      log(`  animation-iteration-count:${cs.animationIterationCount}`);
      log(`  animation-direction:      ${cs.animationDirection}`);
      log(`  animation-play-state:     ${cs.animationPlayState}`);
      log(`  animation-timing-function:${cs.animationTimingFunction}`);
      log(`  will-change:              ${cs.willChange}`);
      log(`  position:                 ${cs.position}`);
      log(`  inset:                    ${cs.inset}`);
      log(`  transform:                ${cs.transform}`);

      const getAnims = (el as HTMLElement & {
        getAnimations?: () => Animation[];
      }).getAnimations;
      if (typeof getAnims === "function") {
        const anims = getAnims.call(el);
        log(`  getAnimations() count: ${anims.length}`);
        anims.forEach((a, j) => {
          const cssAnim = a as Animation & { animationName?: string };
          log(
            `    anim[${j}] name=${cssAnim.animationName ?? "?"} ` +
              `playState=${a.playState} ` +
              `currentTime=${a.currentTime}`
          );
        });
      } else {
        log("  getAnimations() unsupported in this browser");
      }
    });

    let tick = 0;
    const TOTAL_TICKS = 10;
    const interval = window.setInterval(() => {
      tick += 1;
      const t0 = window.getComputedStyle(wrappers[0]).transform;
      const t1 =
        wrappers.length > 1
          ? window.getComputedStyle(wrappers[1]).transform
          : "(no wrapper #2)";
      log(`tick ${tick}/${TOTAL_TICKS} transforms — A: ${t0} | B: ${t1}`);
      if (tick >= TOTAL_TICKS) {
        window.clearInterval(interval);
        log("== diagnostic complete ==");
      }
    }, 1000);

    return () => window.clearInterval(interval);
  }, []);

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
              <div className={styles.portraitBreath}>
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
              </div>
              <span className={styles.portraitName}>{founder.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
