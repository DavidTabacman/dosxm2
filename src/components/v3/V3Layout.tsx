import { type ReactNode } from "react";
import styles from "./V3Layout.module.css";

interface V3LayoutProps {
  children: ReactNode;
  fontClassName: string;
}

export default function V3Layout({ children, fontClassName }: V3LayoutProps) {
  return (
    <div className={`${styles.root} ${fontClassName}`}>
      {children}
    </div>
  );
}
