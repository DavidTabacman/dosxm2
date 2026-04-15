import { type ReactNode, useEffect } from "react";
import styles from "./V2Layout.module.css";

interface V2LayoutProps {
  children: ReactNode;
  fontClassName: string;
}

export default function V2Layout({ children, fontClassName }: V2LayoutProps) {
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.history.scrollRestoration = "manual";
      window.scrollTo(0, 0);
    }
  }, []);

  return (
    <div className={`${styles.root} ${fontClassName}`}>
      {children}
    </div>
  );
}
