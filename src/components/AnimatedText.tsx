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
  const words = text.split(" ");
  let charIndex = 0;

  return createElement(
    tag,
    { className, id },
    <span className={styles.srOnly}>{text}</span>,
    ...words.flatMap((word, wordIdx) => {
      const wordSpan = (
        <span key={`w${wordIdx}`} className={styles.word} aria-hidden="true">
          {word.split("").map((char) => {
            const idx = charIndex++;
            return (
              <span
                key={idx}
                className={styles.char}
                style={{ animationDelay: `${delayMs + idx * staggerMs}ms` }}
              >
                {char}
              </span>
            );
          })}
        </span>
      );
      charIndex++; // count the space
      if (wordIdx < words.length - 1) {
        return [
          wordSpan,
          <span
            key={`s${wordIdx}`}
            aria-hidden="true"
            className={styles.char}
            style={{ animationDelay: `${delayMs + (charIndex - 1) * staggerMs}ms` }}
          >
            {"\u00A0"}
          </span>,
        ];
      }
      return [wordSpan];
    })
  );
}
