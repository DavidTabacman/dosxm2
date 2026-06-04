import Link from "next/link";
import { useCallback, useEffect, useRef } from "react";
import { useSectionReveal } from "../shared/useSectionReveal";
import { useReducedMotion } from "../shared/useReducedMotion";
import styles from "./V4Diferencial.module.css";
import anim from "./v4-animations.module.css";

export interface Founder {
  name: string;
  portraitUrl: string;
  alt: string;
  /**
   * Optional cinemagraph loop. When provided AND reduced-motion is off,
   * the founder card renders a `<video>` instead of the still `<img>` —
   * the only DOM technique that actually engages the brain's biological
   * motion pathway (per Johansson 1973 + PNAS biological-motion research).
   * Without this, we degrade to a still `<img>` animated by the outer
   * card breath (visible motion, but rigid — see debug brief).
   *
   * Both formats SHOULD be provided so Safari (no AV1 on older versions)
   * can fall back to H.264. The poster attribute uses `portraitUrl`.
   */
  loopVideo?: {
    webm?: string;
    mp4: string;
  };
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
  const [revealRef, isRevealed] = useSectionReveal(0.15);
  const reducedMotion = useReducedMotion();
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const sectionRef = useRef<HTMLElement | null>(null);

  const setSectionRef = useCallback(
    (node: HTMLElement | null) => {
      revealRef(node);
      sectionRef.current = node;
    },
    [revealRef]
  );

  // Pause/resume cinemagraph videos based on viewport intersection so
  // mobile battery doesn't burn on a perpetually-decoding loop. No-op
  // when reduced-motion is set (because the videos won't render in
  // that case) or when running in a test environment without IO.
  useEffect(() => {
    if (reducedMotion) return;
    if (typeof IntersectionObserver === "undefined") return;
    const node = sectionRef.current;
    if (!node) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        videoRefs.current.forEach((v) => {
          if (!v) return;
          if (entry.isIntersecting) {
            v.play().catch(() => {});
          } else {
            v.pause();
          }
        });
      },
      { threshold: 0.05 }
    );
    io.observe(node);
    return () => io.disconnect();
  }, [reducedMotion]);

  /* ============================================================
     TEMP DIAGNOSTIC — remove once the breath effect is confirmed
     working on the live site. Runs once on mount, dumps the full
     state of the portrait DOM + CSS + Web Animations, then samples
     computed `transform` every 1s for 10 ticks to prove (or
     disprove) that the animation is actually progressing.
     ============================================================ */
  useEffect(() => {
    const TAG = "[V4-Diferencial CardBreath DIAG]";
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
    log("reducedMotion (from hook state):", reducedMotion);
    log(
      "rendered mode per card:",
      videoRefs.current.map((v) => (v ? "video" : "img"))
    );
    log(
      "CSS.supports animation-timeline view():",
      typeof CSS !== "undefined" && CSS.supports
        ? CSS.supports("animation-timeline: view()")
        : "CSS.supports unavailable"
    );
    log("CSS module styles.portraitOuter  =", styles.portraitOuter);
    log("CSS module styles.portrait       =", styles.portrait);
    log("CSS module styles.portraitFrame  =", styles.portraitFrame);

    const outers = document.querySelectorAll(
      `.${styles.portraitOuter}`
    ) as NodeListOf<HTMLElement>;
    const outersByAttr = document.querySelectorAll(
      "[class*='portraitOuter']"
    );
    log(
      `outers via styles class (${styles.portraitOuter}):`,
      outers.length
    );
    log(
      "outers via [class*='portraitOuter']:",
      outersByAttr.length
    );

    if (outers.length === 0) {
      log(
        "❌ FAIL: no .portraitOuter elements matched the hashed class. " +
          "Either the JSX wrapper is missing, the className didn't resolve, " +
          "or the CSS module hash drifted between bundle and runtime."
      );
      return;
    }

    outers.forEach((el, i) => {
      const cs = window.getComputedStyle(el);
      log(`--- outer #${i + 1} (${el.className}) ---`);
      log(
        `  offset size: ${el.offsetWidth} x ${el.offsetHeight} ` +
          `(now wraps frame, shadow, name tag — whole card moves)`
      );
      log(`  animation-name:           ${cs.animationName}`);
      log(`  animation-duration:       ${cs.animationDuration}`);
      log(`  animation-delay:          ${cs.animationDelay}`);
      log(`  animation-iteration-count:${cs.animationIterationCount}`);
      log(`  animation-direction:      ${cs.animationDirection}`);
      log(`  animation-play-state:     ${cs.animationPlayState}`);
      log(`  animation-timing-function:${cs.animationTimingFunction}`);
      log(`  will-change:              ${cs.willChange}`);
      log(`  position:                 ${cs.position}`);
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
      const t0 = window.getComputedStyle(outers[0]).transform;
      const t1 =
        outers.length > 1
          ? window.getComputedStyle(outers[1]).transform
          : "(no outer #2)";
      log(`tick ${tick}/${TOTAL_TICKS} transforms — A: ${t0} | B: ${t1}`);
      if (tick >= TOTAL_TICKS) {
        window.clearInterval(interval);
        log("== diagnostic complete ==");
      }
    }, 1000);

    return () => window.clearInterval(interval);
  }, [reducedMotion]);

  return (
    <section
      id={id}
      className={styles.section}
      ref={setSectionRef}
      aria-labelledby="v4-diferencial-heading"
    >
      <div className={styles.grid}>
        <div
          className={`${styles.copyBlock} ${anim.stagger} ${
            isRevealed ? anim.staggerVisible : ""
          }`}
        >
          <h2 id="v4-diferencial-heading" className={styles.heading}>
            Dos profesionales,{" "}
            <span className={styles.headingAccent}>un mismo objetivo.</span>
          </h2>
          <p className={styles.lede}>
            En un sector donde la mayoría trabaja solo, nosotros somos un
            equipo consolidado.
          </p>
          <div className={styles.ruleAccent} aria-hidden="true" />
          <p className={styles.body}>
            Varios años de experiencia avalan nuestro trabajo, demostrando un
            compromiso innegociable, trato personal a tope y resultados 100%
            demostrables en Madrid, que hacen que nuestros clientes nos
            recomienden siempre.
          </p>
          <p className={styles.body}>
            Cada casa tiene su historia, y nosotros trabajaremos hasta que la
            tuya esté contada.
          </p>
          <span className={styles.signature}>
            <span className={styles.signatureRule} aria-hidden="true" />
            <span>{founderA.name} &amp; {founderB.name}</span>
          </span>
          <Link href="/conocenos" className={styles.signatureLink}>
            Más sobre {founderA.name} y {founderB.name}
            <span className={styles.signatureLinkArrow} aria-hidden="true">
              →
            </span>
          </Link>
        </div>

        <div
          className={`${styles.portraits} ${anim.revealTarget} ${
            isRevealed ? anim.revealTargetVisible : ""
          } ${portraitsDetached ? styles.portraitsDetached : ""}`}
          data-detached={portraitsDetached ? "true" : "false"}
        >
          {[founderA, founderB].map((founder, idx) => (
            <div
              key={founder.name}
              className={`${styles.portraitOuter} ${
                idx === 1 ? styles.portraitOuterAlt : ""
              }`}
            >
              <div className={styles.portraitFrame}>
                {founder.loopVideo && !reducedMotion ? (
                  <video
                    ref={(el) => {
                      videoRefs.current[idx] = el;
                    }}
                    className={styles.portrait}
                    data-asset-type="founder-portrait-video"
                    poster={founder.portraitUrl}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    aria-hidden="true"
                    onError={() => {
                      // Don't hide the <video> — the browser keeps rendering
                      // the `poster` image as long as the element is mounted,
                      // so a source-load failure gracefully degrades to the
                      // still portrait without any DOM mutation from us.
                      console.error(
                        `[V4-Diferencial] ❌ Video for "${founder.name}" failed — ` +
                          `falling back to still poster.`
                      );
                    }}
                  >
                    {founder.loopVideo.webm && (
                      <source
                        src={founder.loopVideo.webm}
                        type="video/webm"
                      />
                    )}
                    <source src={founder.loopVideo.mp4} type="video/mp4" />
                  </video>
                ) : (
                  /* eslint-disable-next-line @next/next/no-img-element */
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
                )}
                <span className={styles.portraitName}>{founder.name}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
