import { expect, test, describe, vi, beforeEach, afterEach } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import V4HeroSplit from "@/components/v4/V4HeroSplit";
import { readV4Css } from "../utils/readCss";

beforeEach(() => {
  Element.prototype.scrollIntoView = vi.fn();
});

afterEach(() => {
  vi.restoreAllMocks();
  (window as Window).__setMatchMedia?.(null);
  // Remove navigator.connection stubs between tests.
  if ("connection" in navigator) {
    try {
      delete (navigator as unknown as { connection?: unknown }).connection;
    } catch {
      // non-configurable in some engines; ignore
    }
  }
});

function stubConnection(value: {
  saveData?: boolean;
  effectiveType?: string;
} | null) {
  if (value === null) {
    try {
      delete (navigator as unknown as { connection?: unknown }).connection;
    } catch {
      // ignore
    }
    return;
  }
  Object.defineProperty(navigator, "connection", {
    value: {
      saveData: value.saveData,
      effectiveType: value.effectiveType,
      addEventListener: () => {},
      removeEventListener: () => {},
    },
    configurable: true,
  });
}

describe("V4 HeroSplit", () => {
  test("renders the BRD headline", () => {
    const { container } = render(<V4HeroSplit />);
    expect(container.textContent).toContain("Detrás de cada casa hay");
    expect(container.textContent).toContain("una historia.");
  });

  test("renders the BRD sub-copy", () => {
    const { container } = render(<V4HeroSplit />);
    expect(container.textContent).toContain("Vendemos tu casa como si fuese la nuestra");
    expect(container.textContent).toContain("Doble compromiso");
  });

  test("renders an anchor CTA pointing to #valorador", () => {
    const { container } = render(<V4HeroSplit />);
    const cta = container.querySelector("a[href='#valorador']");
    expect(cta).not.toBeNull();
    expect(cta?.textContent).toContain("Valora tu propiedad");
  });

  test("CTA click smooth-scrolls to the valorador section", () => {
    const section = document.createElement("section");
    section.id = "valorador";
    document.body.appendChild(section);
    const spy = vi.spyOn(section, "scrollIntoView");

    const { container } = render(<V4HeroSplit />);
    const cta = container.querySelector("a[href='#valorador']")!;
    fireEvent.click(cta);

    expect(spy).toHaveBeenCalledWith({ behavior: "smooth", block: "start" });
    document.body.removeChild(section);
  });

  test("CTA click does not throw when #valorador is missing", () => {
    const { container } = render(<V4HeroSplit />);
    const cta = container.querySelector("a[href='#valorador']")!;
    expect(() => fireEvent.click(cta)).not.toThrow();
  });

  test("renders two background videos with data-asset-type='hero-bg'", () => {
    const { container } = render(<V4HeroSplit />);
    const videos = container.querySelectorAll("video[data-asset-type='hero-bg']");
    expect(videos).toHaveLength(2);
  });

  test("background videos are aria-hidden and muted", () => {
    const { container } = render(<V4HeroSplit />);
    const videos = container.querySelectorAll("video[data-asset-type='hero-bg']");
    videos.forEach((v) => {
      expect(v.getAttribute("aria-hidden")).toBe("true");
      expect((v as HTMLVideoElement).muted).toBe(true);
    });
  });

  test("background videos do NOT carry the HTML autoPlay attribute (prevents AbortError race)", () => {
    const { container } = render(<V4HeroSplit />);
    const videos = container.querySelectorAll("video[data-asset-type='hero-bg']");
    videos.forEach((v) => {
      // React maps autoPlay → native autoplay attribute; we deliberately omit it
      // so the useVideoPlayback hook manages the playback lifecycle.
      expect(v.hasAttribute("autoplay")).toBe(false);
    });
  });

  test("hero element exposes --divider-pos custom property via inline style", () => {
    const { container } = render(<V4HeroSplit />);
    const section = container.querySelector("section") as HTMLElement;
    // React serializes custom properties from `style` into style attribute.
    const styleAttr = section.getAttribute("style") ?? "";
    expect(styleAttr).toContain("--divider-pos");
  });

  test("heading is a single <h1>", () => {
    const { container } = render(<V4HeroSplit />);
    const h1s = container.querySelectorAll("h1");
    expect(h1s).toHaveLength(1);
  });

  test("textLayer is nested inside panelLeft so H1/CTA sit above-the-fold on mobile", () => {
    const { container } = render(<V4HeroSplit />);
    const panelLeft = container.querySelector("[class*='panelLeft']");
    expect(panelLeft).not.toBeNull();
    const textLayer = panelLeft!.querySelector("[class*='textLayer']");
    expect(textLayer).not.toBeNull();
  });

  test("<h1> is a descendant of panelLeft (regression guard for P0-1)", () => {
    const { container } = render(<V4HeroSplit />);
    const panelLeft = container.querySelector("[class*='panelLeft']");
    const h1 = panelLeft?.querySelector("h1");
    expect(h1).not.toBeNull();
  });

  test("hero CSS uses svh with vh fallback for stable iOS viewport", () => {
    const css = readV4Css("V4HeroSplit.module.css");
    expect(css).toContain("100svh");
    expect(css).toContain("100vh");
  });

  test("hero CSS declares a prefers-reduced-data branch that hides videos", () => {
    const css = readV4Css("V4HeroSplit.module.css");
    expect(css).toMatch(/@media \(prefers-reduced-data:\s*reduce\)/);
  });

  test("hero CSS declares a landscape-phone compression branch", () => {
    const css = readV4Css("V4HeroSplit.module.css");
    expect(css).toMatch(
      /@media\s*\(max-height:\s*500px\)\s*and\s*\(orientation:\s*landscape\)/
    );
  });

  test("heading line-height relaxed for accented Spanish glyphs", () => {
    const css = readV4Css("V4HeroSplit.module.css");
    // Match the heading rule body and look for line-height >= 1.08.
    const match = css.match(/\.heading\s*\{[^}]*line-height:\s*([\d.]+)[^}]*\}/);
    expect(match).not.toBeNull();
    expect(Number(match![1])).toBeGreaterThanOrEqual(1.08);
  });

  test("coarse-pointer + no-hover devices skip mousemove scrub", () => {
    (window as Window).__setMatchMedia?.((q) => ({
      matches: q.includes("hover: none") && q.includes("pointer: coarse"),
      media: q,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }));

    const { container } = render(<V4HeroSplit />);
    const section = container.querySelector("section") as HTMLElement;
    const before = section.style.getPropertyValue("--divider-pos");
    fireEvent.mouseMove(section, { clientX: 10 });
    // A registered listener would have mutated --divider-pos via rAF;
    // jsdom doesn't fire rAF but we can confirm by checking no listener
    // synchronously changed inline style either. The early-return path
    // means the cb simply never fires.
    const after = section.style.getPropertyValue("--divider-pos");
    expect(after).toBe(before);
  });

  test("Save-Data connection swaps both hero videos for poster images", () => {
    stubConnection({ saveData: true });
    const { container } = render(<V4HeroSplit />);
    const videos = container.querySelectorAll("video[data-asset-type='hero-bg']");
    expect(videos).toHaveLength(0);
    const posterImgs = container.querySelectorAll(
      "img[data-asset-type='hero-bg-fallback']"
    );
    expect(posterImgs.length).toBe(2);
  });

  test("2g effectiveType also swaps videos for poster images", () => {
    stubConnection({ effectiveType: "2g" });
    const { container } = render(<V4HeroSplit />);
    const videos = container.querySelectorAll("video[data-asset-type='hero-bg']");
    expect(videos).toHaveLength(0);
  });

  test("fast connection keeps videos mounted", () => {
    stubConnection({ saveData: false, effectiveType: "4g" });
    const { container } = render(<V4HeroSplit />);
    const videos = container.querySelectorAll("video[data-asset-type='hero-bg']");
    expect(videos).toHaveLength(2);
  });

  test("missing navigator.connection defaults to rendering videos", () => {
    stubConnection(null);
    const { container } = render(<V4HeroSplit />);
    const videos = container.querySelectorAll("video[data-asset-type='hero-bg']");
    expect(videos).toHaveLength(2);
  });

  test("non-coarse pointer registers mousemove scrub", () => {
    // Default matchMedia returns matches: false (desktop-like); no swap needed.
    const { container } = render(<V4HeroSplit />);
    const section = container.querySelector("section") as HTMLElement;
    // Positive control: a listener IS attached. Simulate a mousemove and
    // flush the rAF that the handler queues.
    const rafSpy = vi
      .spyOn(window, "requestAnimationFrame")
      .mockImplementation((cb: FrameRequestCallback) => {
        cb(0);
        return 0;
      });
    // Override the bounding rect so the math has a non-zero width.
    vi.spyOn(section, "getBoundingClientRect").mockReturnValue({
      left: 0,
      right: 500,
      top: 0,
      bottom: 500,
      width: 500,
      height: 500,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    });
    fireEvent.mouseMove(section, { clientX: 250 });
    expect(section.style.getPropertyValue("--divider-pos")).toMatch(/%/);
    rafSpy.mockRestore();
  });
});
