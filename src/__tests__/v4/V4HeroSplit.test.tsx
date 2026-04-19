import { expect, test, describe, vi, beforeEach, afterEach } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import V4HeroSplit from "@/components/v4/V4HeroSplit";

beforeEach(() => {
  Element.prototype.scrollIntoView = vi.fn();
});

afterEach(() => {
  vi.restoreAllMocks();
});

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
});
