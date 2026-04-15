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
    const isExternal = href.startsWith("http");
    return (
      <a
        href={href}
        className={className}
        data-cursor="pointer"
        {...(isExternal && { target: "_blank", rel: "noopener noreferrer" })}
      >
        {text}
      </a>
    );
  }

  return (
    <button type="button" className={className} data-cursor="pointer" onClick={onClick}>
      {text}
    </button>
  );
}
