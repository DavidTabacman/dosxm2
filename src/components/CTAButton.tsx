import styles from "./CTAButton.module.css";

interface CTAButtonProps {
  text: string;
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "outline";
}

export default function CTAButton({
  text,
  href,
  onClick,
  variant = "primary",
}: CTAButtonProps) {
  const className = `${styles.cta} ${styles[variant]}`;

  if (href) {
    return (
      <a href={href} className={className}>
        {text}
      </a>
    );
  }

  return (
    <button type="button" className={className} onClick={onClick}>
      {text}
    </button>
  );
}
