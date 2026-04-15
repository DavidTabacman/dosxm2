import { type ReactNode } from "react";
import styles from "./V2Layout.module.css";

interface V2LayoutProps {
  children: ReactNode;
  fontClassName: string;
}

export default function V2Layout({ children, fontClassName }: V2LayoutProps) {
  return (
    <div className={`${styles.root} ${fontClassName}`}>
      {children}
    </div>
  );
}
