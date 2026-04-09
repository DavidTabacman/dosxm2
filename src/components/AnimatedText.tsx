import { createElement } from "react";
import styles from "./AnimatedText.module.css";

interface AnimatedTextProps {
  text: string;
  tag?: "h1" | "h2" | "p" | "span";
  className?: string;
  id?: string;
  delayMs?: number;
  staggerMs?: number;
}

export default function AnimatedText({
  text,
  tag = "span",
  className,
  id,
  delayMs = 0,
  staggerMs = 40,
}: AnimatedTextProps) {
  const characters = text.split("");

  return createElement(
    tag,
    { className, id },
    <span className={styles.srOnly}>{text}</span>,
    ...characters.map((char, i) => (
      <span
        key={i}
        aria-hidden="true"
        className={styles.char}
        style={{ animationDelay: `${delayMs + i * staggerMs}ms` }}
      >
        {char === " " ? "\u00A0" : char}
      </span>
    ))
  );
}
