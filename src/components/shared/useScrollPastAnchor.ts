import { useEffect, useState } from "react";

/**
 * Reports whether the document has scrolled fully past the element matching
 * `selector` (i.e. the element's bottom edge is above the viewport's top edge).
 *
 * Used to coordinate the V4 "portraits detach into FAB" handoff: both the
 * Diferencial section and the WhatsApp FAB read the same boolean so their
 * fade-out / fade-in happen against the same truth.
 *
 * Stays connected for the component's lifetime (repeatable — not fire-once).
 * Returns `false` while the target isn't yet mounted or the observer can't
 * attach, preserving a no-FAB default during SSR / hydration.
 */
export function useScrollPastAnchor(selector: string): boolean {
  const [pastAnchor, setPastAnchor] = useState(false);

  useEffect(() => {
    if (typeof document === "undefined") return;

    let observer: IntersectionObserver | null = null;
    let cancelled = false;

    function attach() {
      if (cancelled) return;
      const target = document.querySelector(selector);
      if (!target) {
        // Target may not be mounted yet on first paint — retry once on next
        // animation frame, then give up quietly.
        requestAnimationFrame(() => {
          if (cancelled) return;
          const retry = document.querySelector(selector);
          if (!retry) {
            console.warn(
              `[useScrollPastAnchor] ⚠️ Anchor "${selector}" not found after retry. ` +
                `Reason: section never mounted or selector is wrong.`
            );
            return;
          }
          observe(retry);
        });
        return;
      }
      observe(target);
    }

    function observe(target: Element) {
      if (typeof IntersectionObserver === "undefined") {
        console.warn(
          `[useScrollPastAnchor] ⚠️ IntersectionObserver unavailable — selector "${selector}" will never toggle. ` +
            `Reason: SSR pre-hydration or very old browser.`
        );
        return;
      }
      observer = new IntersectionObserver(
        ([entry]) => {
          // bottom <= 0 means the section is fully above the viewport —
          // i.e. the user has scrolled past it.
          const next = entry.boundingClientRect.bottom <= 0;
          setPastAnchor(next);
        },
        { threshold: 0, rootMargin: "0px" }
      );
      observer.observe(target);
    }

    attach();
    return () => {
      cancelled = true;
      observer?.disconnect();
    };
  }, [selector]);

  return pastAnchor;
}
