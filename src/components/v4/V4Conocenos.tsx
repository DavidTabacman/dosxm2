import V4ConocenosAct from "./V4ConocenosAct";
import V4ConocenosJuntos from "./V4ConocenosJuntos";
import {
  FOUNDER_BIOS,
  FOUNDER_BORJA,
  FOUNDER_PABLO,
} from "@/constants/founders";
import styles from "./V4Conocenos.module.css";

/**
 * Page-level orchestrator for /v4/conocenos. Renders the three-act
 * scrollytelling sequence (Pablo solo → Borja solo → Juntos finale).
 * No state, no hooks — composition only. Data flows from
 * `@/constants/founders` so a copy edit is a one-file change.
 */
export default function V4Conocenos() {
  return (
    <main id="conocenos-main" className={styles.page}>
      <header className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Conócenos</h1>
      </header>

      <V4ConocenosAct
        id="pablo"
        headingId="v4-conocenos-pablo-heading"
        side="left"
        founder={FOUNDER_PABLO}
        bio={FOUNDER_BIOS.pablo}
        isLcp
      />

      <V4ConocenosAct
        id="borja"
        headingId="v4-conocenos-borja-heading"
        side="right"
        founder={FOUNDER_BORJA}
        bio={FOUNDER_BIOS.borja}
      />

      <V4ConocenosJuntos />
    </main>
  );
}
