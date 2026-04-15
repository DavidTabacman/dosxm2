import { type ReactNode } from "react";
import styles from "./V1Layout.module.css";

interface V1LayoutProps {
  children: ReactNode;
  fontClassName: string;
}

export default function V1Layout({ children, fontClassName }: V1LayoutProps) {
  return (
    <div className={`${styles.root} ${fontClassName}`}>
      {children}
    </div>
  );
}
