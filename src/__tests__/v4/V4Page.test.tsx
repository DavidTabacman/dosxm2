import { expect, test, describe, vi, beforeEach, afterEach } from "vitest";
import { render, act } from "@testing-library/react";
import V4Page from "@/pages/v4";

vi.mock("next/head", () => ({
  default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

// next/font/google is not available in the test environment. Return a stub
// matching next/font's public contract (variable + className + style).
vi.mock("next/font/google", () => {
  const stubFont = () => ({
    variable: "--font-stub",
    className: "font-stub",
    style: { fontFamily: "stub" },
  });
  return { Fraunces: stubFont, Inter: stubFont };
});

// Prevent hook side effects from piling up with real timers.
vi.mock("@/components/shared/useSectionReveal", () => ({
  useSectionReveal: () => [() => {}, true],
}));

vi.mock("@/components/shared/useSectionVisible", () => ({
  useSectionVisible: () => [() => {}, true],
}));

const scrollPastRef = { current: false };
vi.mock("@/components/shared/useScrollPastAnchor", () => ({
  useScrollPastAnchor: () => scrollPastRef.current,
}));

describe("V4 Page (integration)", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    Element.prototype.scrollIntoView = vi.fn();
    scrollPastRef.current = false;
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  test("mounts without throwing", () => {
    expect(() => render(<V4Page />)).not.toThrow();
  });

  test("contains all BRD section anchors", () => {
    const { container } = render(<V4Page />);
    const ids = ["diferencial", "resultados", "historias", "resenas", "contacto"];
    const sectionIds = Array.from(container.querySelectorAll("section"))
      .map((s) => s.id)
      .filter(Boolean);
    ids.forEach((id) => {
      expect(sectionIds).toContain(id);
    });
  });

  test("renders exactly one sticky header <header>", () => {
    const { container } = render(<V4Page />);
    const headers = container.querySelectorAll("header[role='banner']");
    expect(headers.length).toBe(1);
  });

  test("renders hero heading", () => {
    const { container } = render(<V4Page />);
    expect(container.textContent).toContain("Detrás de cada casa hay");
  });

  test("includes metrics tiles with BRD data (30 días, 100%, 24/7)", () => {
    const { container } = render(<V4Page />);
    // 24/7 appears immediately (non-numeric)
    expect(container.textContent).toContain("24/7");
    // numeric metrics appear after count-up completes
    act(() => {
      vi.advanceTimersByTime(2200);
    });
    expect(container.textContent).toContain("30");
    expect(container.textContent).toContain("100");
  });

  test("renders hero CTA linking to the external Lystos valuation tool", () => {
    const { container } = render(<V4Page />);
    const cta = container.querySelector(
      "a[href*='valuation.lystos.com']",
    );
    expect(cta).not.toBeNull();
    expect(cta?.getAttribute("target")).toBe("_blank");
  });

  test("renders exactly one h1 on the page (accessibility)", () => {
    const { container } = render(<V4Page />);
    const h1s = container.querySelectorAll("h1");
    expect(h1s.length).toBe(1);
  });

  test("renders the WhatsApp FAB with wa.me href", () => {
    const { container } = render(<V4Page />);
    const fabLink = container.querySelector("a[href*='wa.me']");
    expect(fabLink).not.toBeNull();
  });

  test("Fraunces loads only weight 400 to trim ~30KB gzip (P3-1)", () => {
    // The Fraunces stub doesn't expose the weight option — this is a source
    // read against src/pages/v4.tsx to guard the trim.
    const { readFileSync } = eval("require('fs')") as typeof import("fs");
    const { resolve } = eval("require('path')") as typeof import("path");
    const src = readFileSync(resolve(process.cwd(), "src/pages/v4.tsx"), "utf8");
    expect(src).toMatch(/Fraunces\(\s*{[^}]*weight:\s*\[\s*"400"\s*\]/);
  });

  test("declares viewport meta with viewport-fit=cover for safe-area support", () => {
    // React 19 hoists <meta> into document.head automatically; the next/head
    // mock renders children as a fragment, so the viewport meta lands there.
    render(<V4Page />);
    const viewport =
      document.querySelector("meta[name='viewport']") ??
      document.head.querySelector("meta[name='viewport']");
    expect(viewport).not.toBeNull();
    expect(viewport?.getAttribute("content")).toContain("viewport-fit=cover");
  });

  test("renders the footer with 'DOSXM2' branding", () => {
    const { container } = render(<V4Page />);
    const footer = container.querySelector("footer[role='contentinfo']");
    expect(footer).not.toBeNull();
    expect(footer?.textContent).toContain("DOSXM2");
  });

  test("every BRD section has a scrollable id target", () => {
    const { container } = render(<V4Page />);
    // The sticky header nav links should each resolve to a real section.
    const ids = ["diferencial", "resultados", "historias", "resenas", "contacto"];
    const sectionIds = new Set(
      Array.from(container.querySelectorAll("section[id]")).map((s) => s.id)
    );
    ids.forEach((id) => {
      expect(sectionIds.has(id)).toBe(true);
    });
  });

  test("before scrolling past Diferencial, portraits are attached and FAB hidden", () => {
    scrollPastRef.current = false;
    const { container } = render(<V4Page />);
    const portraits = container.querySelector("[data-detached]");
    expect(portraits?.getAttribute("data-detached")).toBe("false");

    const fab = container.querySelector("[data-testid='v4-whatsapp-fab']");
    expect(fab?.getAttribute("aria-hidden")).toBe("true");
  });

  test("after scrolling past Diferencial, portraits detach and FAB is visible", () => {
    scrollPastRef.current = true;
    const { container } = render(<V4Page />);
    // FAB needs its 100ms arming delay before becoming visible.
    act(() => {
      vi.advanceTimersByTime(200);
    });

    const portraits = container.querySelector("[data-detached]");
    expect(portraits?.getAttribute("data-detached")).toBe("true");

    const fab = container.querySelector("[data-testid='v4-whatsapp-fab']");
    expect(fab?.getAttribute("aria-hidden")).toBe("false");
  });
});
