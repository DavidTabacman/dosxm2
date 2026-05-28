import { type ReactNode, useEffect } from "react";
import styles from "./V5Layout.module.css";

interface V5LayoutProps {
  children: ReactNode;
  fontClassName: string;
}

export default function V5Layout({ children, fontClassName }: V5LayoutProps) {
  // Start every visit at the top so sticky header + intersection observers
  // evaluate from a predictable state (matches V2Layout behavior).
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.history.scrollRestoration = "manual";
      window.scrollTo(0, 0);
    }
  }, []);

  return <div className={`${styles.root} ${fontClassName}`}>{children}</div>;
}
