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

describe("V4 Page (integration)", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    Element.prototype.scrollIntoView = vi.fn();
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
    const ids = ["diferencial", "resultados", "historias", "resenas", "valorador"];
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

  test("renders valorador CTA linking to #valorador", () => {
    const { container } = render(<V4Page />);
    const cta = container.querySelector("a[href='#valorador']");
    expect(cta).not.toBeNull();
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

  test("renders the footer with 'DOSXM2' branding", () => {
    const { container } = render(<V4Page />);
    const footer = container.querySelector("footer[role='contentinfo']");
    expect(footer).not.toBeNull();
    expect(footer?.textContent).toContain("DOSXM2");
  });

  test("every BRD section has a scrollable id target", () => {
    const { container } = render(<V4Page />);
    // The sticky header nav links should each resolve to a real section.
    const ids = ["diferencial", "resultados", "historias", "resenas", "valorador"];
    const sectionIds = new Set(
      Array.from(container.querySelectorAll("section[id]")).map((s) => s.id)
    );
    ids.forEach((id) => {
      expect(sectionIds.has(id)).toBe(true);
    });
  });
});
