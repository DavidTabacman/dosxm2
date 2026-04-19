import { type ReactNode, useEffect } from "react";
import styles from "./V4Layout.module.css";

interface V4LayoutProps {
  children: ReactNode;
  fontClassName: string;
}

export default function V4Layout({ children, fontClassName }: V4LayoutProps) {
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
