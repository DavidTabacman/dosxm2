import { type RefObject, useEffect, useRef, useState } from "react";

interface Position {
  x: number;
  y: number;
}

export function useMousePosition(ref: RefObject<HTMLElement | null>): Position {
  const [position, setPosition] = useState<Position>({ x: 0.5, y: 0.5 });
  const rafRef = useRef<number>(0);
  const isTouchDevice = useRef(false);

  useEffect(() => {
    isTouchDevice.current =
      typeof window !== "undefined" && "ontouchstart" in window;

    if (isTouchDevice.current || !ref.current) return;

    const el = ref.current;

    function handleMouseMove(e: MouseEvent) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect();
        const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
        setPosition({ x, y });
      });
    }

    el.addEventListener("mousemove", handleMouseMove);

    return () => {
      el.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, [ref]);

  return position;
}
