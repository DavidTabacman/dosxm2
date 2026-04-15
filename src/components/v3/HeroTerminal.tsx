import { useEffect, useRef, useState } from "react";
import styles from "./HeroTerminal.module.css";

const HEADING_TEXT = "VENDEMOS TU CASA COMO SI FUESE LA NUESTRA.";
const SUB_TEXT = "Datos reales. Transparencia total. Cero excusas.";
const SCRAMBLE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&*!?<>{}[]";
const SCRAMBLE_DURATION = 1200;
const SCRAMBLE_INTERVAL = 30;

function useTextScramble(text: string, startDelay = 0) {
  const [display, setDisplay] = useState("");
  const [done, setDone] = useState(false);
  const hasRun = useRef(false);
  const activeRef = useRef(true);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;
    activeRef.current = true;

    // Check reduced motion
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDisplay(text);
      setDone(true);
      return;
    }

    let tickTimer: ReturnType<typeof setTimeout>;

    const timeout = setTimeout(() => {
      const startTime = performance.now();
      const totalChars = text.length;

      function tick() {
        if (!activeRef.current) return;

        const elapsed = performance.now() - startTime;
        const progress = Math.min(elapsed / SCRAMBLE_DURATION, 1);
        const revealedCount = Math.floor(progress * totalChars);

        let result = "";
        for (let i = 0; i < totalChars; i++) {
          if (text[i] === " ") {
            result += " ";
          } else if (i < revealedCount) {
            result += text[i];
          } else {
            result += SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
          }
        }

        setDisplay(result);

        if (progress < 1) {
          tickTimer = setTimeout(tick, SCRAMBLE_INTERVAL);
        } else {
          setDisplay(text);
          setDone(true);
        }
      }

      tick();
    }, startDelay);

    return () => {
      activeRef.current = false;
      clearTimeout(timeout);
      clearTimeout(tickTimer);
    };
  }, [text, startDelay]);

  return { display, done };
}

export default function HeroTerminal() {
  const heading = useTextScramble(HEADING_TEXT, 400);
  const sub = useTextScramble(SUB_TEXT, 1700);

  // Grid lines positions
  const vLines = [8, 25, 50, 75, 92];
  const hLines = [20, 50, 80];

  return (
    <section className={styles.hero}>
      <div className={styles.gridOverlay} aria-hidden="true">
        {vLines.map((pos, i) => (
          <div
            key={`v${i}`}
            className={styles.gridLineV}
            style={{ left: `${pos}%`, animationDelay: `${i * 80}ms` }}
          />
        ))}
        {hLines.map((pos, i) => (
          <div
            key={`h${i}`}
            className={styles.gridLineH}
            style={{ top: `${pos}%`, animationDelay: `${(i + vLines.length) * 80}ms` }}
          />
        ))}
      </div>

      <div className={styles.statusLabel}>
        <span className={styles.statusDot} aria-hidden="true" />
        [STATUS: ACTIVE]
      </div>

      <h1 className={styles.heading} aria-label={HEADING_TEXT}>
        <span aria-hidden="true">{heading.display}</span>
        {!heading.done && <span className={styles.cursor} aria-hidden="true" />}
      </h1>

      <p className={styles.subheading} aria-label={SUB_TEXT}>
        <span aria-hidden="true">{sub.display}</span>
        {!sub.done && heading.done && <span className={styles.cursor} aria-hidden="true" />}
      </p>

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className={styles.photo}
        src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=450&fit=crop"
        alt="Interior de propiedad moderna — estilo documental sin filtros"
        data-asset-type="hero-bg"
        loading="eager"
      />
    </section>
  );
}
