import { type ReactNode } from "react";
import CustomCursor from "./CustomCursor";
import styles from "./V1Layout.module.css";

interface V1LayoutProps {
  children: ReactNode;
  fontClassName: string;
}

export default function V1Layout({ children, fontClassName }: V1LayoutProps) {
  return (
    <div className={`${styles.root} ${fontClassName}`}>
      <CustomCursor />
      {children}
    </div>
  );
}
