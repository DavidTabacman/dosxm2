import { expect, test, describe, vi, beforeEach, afterEach } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import V4Diferencial from "@/components/v4/V4Diferencial";

vi.mock("@/components/shared/useSectionReveal", () => ({
  useSectionReveal: () => [() => {}, true],
}));

const FOUNDERS = {
  founderA: {
    name: "Andrea",
    portraitUrl: "https://example.com/a.jpg",
    alt: "Retrato Andrea",
  },
  founderB: {
    name: "Diego",
    portraitUrl: "https://example.com/b.jpg",
    alt: "Retrato Diego",
  },
};

const FOUNDERS_WITH_VIDEO = {
  founderA: {
    ...FOUNDERS.founderA,
    loopVideo: {
      webm: "https://example.com/a.webm",
      mp4: "https://example.com/a.mp4",
    },
  },
  founderB: {
    ...FOUNDERS.founderB,
    loopVideo: {
      webm: "https://example.com/b.webm",
      mp4: "https://example.com/b.mp4",
    },
  },
};

function setReducedMotion(matches: boolean) {
  (window as Window).__setMatchMedia?.((q) => ({
    matches: q.includes("prefers-reduced-motion") ? matches : false,
    media: q,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }));
}

beforeEach(() => {
  setReducedMotion(false);
});

afterEach(() => {
  (window as Window).__setMatchMedia?.(null);
});

describe("V4 Diferencial", () => {
  test("uses #diferencial as default section id", () => {
    const { container } = render(<V4Diferencial {...FOUNDERS} />);
    const section = container.querySelector("section#diferencial");
    expect(section).not.toBeNull();
  });

  test("custom id prop is respected", () => {
    const { container } = render(
      <V4Diferencial {...FOUNDERS} id="custom-id" />
    );
    expect(container.querySelector("section#custom-id")).not.toBeNull();
  });

  test("renders the BRD core message about teamwork", () => {
    const { container } = render(<V4Diferencial {...FOUNDERS} />);
    expect(container.textContent).toContain("Dos profesionales");
    expect(container.textContent).toContain("un mismo objetivo");
    expect(container.textContent).toContain("En un sector donde la mayoría trabaja solo");
    expect(container.textContent).toContain("nosotros somos un equipo consolidado");
  });

  test("renders both founder portraits with correct alt text", () => {
    const { container } = render(<V4Diferencial {...FOUNDERS} />);
    const portraits = container.querySelectorAll(
      "img[data-asset-type='founder-portrait']"
    );
    expect(portraits).toHaveLength(2);
    expect(portraits[0].getAttribute("alt")).toBe("Retrato Andrea");
    expect(portraits[1].getAttribute("alt")).toBe("Retrato Diego");
  });

  test("heading is the accessible label for the section", () => {
    const { container } = render(<V4Diferencial {...FOUNDERS} />);
    const section = container.querySelector("section");
    const labelledBy = section?.getAttribute("aria-labelledby");
    expect(labelledBy).toBe("v4-diferencial-heading");
    // Look up the labelling element via attribute selector — jsdom + CSS
    // modules in this toolchain occasionally mis-resolves "#id" selectors.
    const heading = container.querySelector(`[id="${labelledBy}"]`);
    expect(heading).not.toBeNull();
    expect(heading?.tagName).toBe("H2");
  });

  test("signature shows both founder names", () => {
    const { container } = render(<V4Diferencial {...FOUNDERS} />);
    expect(container.textContent).toContain("Andrea");
    expect(container.textContent).toContain("Diego");
  });

  test("signatureLink anchors to /v4/conocenos and names both founders", () => {
    const { container } = render(<V4Diferencial {...FOUNDERS} />);
    const link = container.querySelector(
      "a[class*='signatureLink']"
    ) as HTMLAnchorElement | null;
    expect(link).not.toBeNull();
    expect(link!.getAttribute("href")).toBe("/v4/conocenos");
    expect(link!.textContent).toContain("Andrea");
    expect(link!.textContent).toContain("Diego");
  });

  test("portrait image fallback hides image on error", () => {
    const { container } = render(<V4Diferencial {...FOUNDERS} />);
    const portrait = container.querySelector(
      "img[data-asset-type='founder-portrait']"
    ) as HTMLImageElement;
    fireEvent.error(portrait);
    expect(portrait.style.visibility).toBe("hidden");
  });

  test("copy block uses stagger animation classes", () => {
    const { container } = render(<V4Diferencial {...FOUNDERS} />);
    const copyBlock = container.querySelector("section")!.children[0]
      .children[0] as HTMLElement;
    expect(copyBlock.className).toContain("stagger");
    expect(copyBlock.className).toContain("staggerVisible");
  });

  test("portraits container marks data-detached=false by default", () => {
    const { container } = render(<V4Diferencial {...FOUNDERS} />);
    const portraits = container.querySelector("[data-detached]");
    expect(portraits?.getAttribute("data-detached")).toBe("false");
  });

  test("portraits container marks data-detached=true when portraitsDetached prop is true", () => {
    const { container } = render(
      <V4Diferencial {...FOUNDERS} portraitsDetached />
    );
    const portraits = container.querySelector("[data-detached]");
    expect(portraits?.getAttribute("data-detached")).toBe("true");
  });

  test("portraits container receives detached class only when detached", () => {
    const { container, rerender } = render(<V4Diferencial {...FOUNDERS} />);
    const portraitsNode = container.querySelector(
      "[data-detached]"
    ) as HTMLElement;
    expect(portraitsNode.className).not.toMatch(/portraitsDetached/);

    rerender(<V4Diferencial {...FOUNDERS} portraitsDetached />);
    const updated = container.querySelector("[data-detached]") as HTMLElement;
    expect(updated.className).toMatch(/portraitsDetached/);
  });
});

describe("V4 Diferencial — live portraits DOM (outer card breath)", () => {
  test("each portrait card is wrapped in a portraitOuter", () => {
    const { container } = render(<V4Diferencial {...FOUNDERS} />);
    const outers = container.querySelectorAll("[class*='portraitOuter']");
    expect(outers).toHaveLength(2);
    outers.forEach((outer) => {
      expect(outer.children).toHaveLength(1);
      const frame = outer.children[0] as HTMLElement;
      expect(frame.className).toMatch(/portraitFrame/);
    });
  });

  test("second portrait card carries the Alt modifier (phase offset target)", () => {
    const { container } = render(<V4Diferencial {...FOUNDERS} />);
    const outers = container.querySelectorAll("[class*='portraitOuter']");
    expect(outers[0].className).not.toMatch(/portraitOuterAlt/);
    expect(outers[1].className).toMatch(/portraitOuterAlt/);
  });

  test("img sits inside portraitFrame directly (no inner breath wrapper)", () => {
    const { container } = render(<V4Diferencial {...FOUNDERS} />);
    const frames = container.querySelectorAll("[class*='portraitFrame']");
    expect(frames).toHaveLength(2);
    frames.forEach((frame) => {
      const img = frame.querySelector(
        "img[data-asset-type='founder-portrait']"
      );
      expect(img).not.toBeNull();
      expect(img!.parentElement).toBe(frame);
    });
  });

  test("portraitBreath wrapper no longer exists (breath moved to outer)", () => {
    const { container } = render(<V4Diferencial {...FOUNDERS} />);
    expect(
      container.querySelectorAll("[class*='portraitBreath']")
    ).toHaveLength(0);
  });

  test("portraitName is a sibling of the img inside the frame", () => {
    const { container } = render(<V4Diferencial {...FOUNDERS} />);
    const frames = container.querySelectorAll("[class*='portraitFrame']");
    frames.forEach((frame) => {
      const name = frame.querySelector("[class*='portraitName']");
      const img = frame.querySelector(
        "img[data-asset-type='founder-portrait']"
      );
      expect(name).not.toBeNull();
      expect(img).not.toBeNull();
      expect(name!.parentElement).toBe(frame);
      expect(img!.parentElement).toBe(frame);
    });
  });

  test("img remains directly queryable by data-asset-type after restructure", () => {
    const { container } = render(<V4Diferencial {...FOUNDERS} />);
    const portraits = container.querySelectorAll(
      "img[data-asset-type='founder-portrait']"
    );
    expect(portraits).toHaveLength(2);
  });

  test("portraitsDetached toggle still works after restructure (no regression)", () => {
    const { container, rerender } = render(<V4Diferencial {...FOUNDERS} />);
    const before = container.querySelector("[data-detached]") as HTMLElement;
    expect(before.getAttribute("data-detached")).toBe("false");

    rerender(<V4Diferencial {...FOUNDERS} portraitsDetached />);
    const after = container.querySelector("[data-detached]") as HTMLElement;
    expect(after.getAttribute("data-detached")).toBe("true");
    expect(after.className).toMatch(/portraitsDetached/);

    const outers = container.querySelectorAll("[class*='portraitOuter']");
    expect(outers).toHaveLength(2);
  });
});

describe("V4 Diferencial — cinemagraph video path", () => {
  test("without loopVideo, renders <img> (still-image fallback path)", () => {
    const { container } = render(<V4Diferencial {...FOUNDERS} />);
    expect(
      container.querySelectorAll("img[data-asset-type='founder-portrait']")
    ).toHaveLength(2);
    expect(
      container.querySelectorAll(
        "video[data-asset-type='founder-portrait-video']"
      )
    ).toHaveLength(0);
  });

  test("with loopVideo, renders <video> with poster + both <source> formats", () => {
    const { container } = render(<V4Diferencial {...FOUNDERS_WITH_VIDEO} />);
    const videos = container.querySelectorAll<HTMLVideoElement>(
      "video[data-asset-type='founder-portrait-video']"
    );
    expect(videos).toHaveLength(2);
    expect(
      container.querySelectorAll("img[data-asset-type='founder-portrait']")
    ).toHaveLength(0);

    videos.forEach((video, i) => {
      expect(video.hasAttribute("autoplay")).toBe(true);
      expect(video.muted).toBe(true);
      expect(video.hasAttribute("loop")).toBe(true);
      expect(video.hasAttribute("playsinline")).toBe(true);
      expect(video.getAttribute("preload")).toBe("metadata");
      expect(video.getAttribute("aria-hidden")).toBe("true");
      const expectedPoster =
        i === 0
          ? FOUNDERS_WITH_VIDEO.founderA.portraitUrl
          : FOUNDERS_WITH_VIDEO.founderB.portraitUrl;
      expect(video.getAttribute("poster")).toBe(expectedPoster);

      const sources = video.querySelectorAll("source");
      expect(sources).toHaveLength(2);
      expect(sources[0].getAttribute("type")).toBe("video/webm");
      expect(sources[1].getAttribute("type")).toBe("video/mp4");
    });
  });

  test("with loopVideo but reducedMotion ON, renders <img> (not <video>)", () => {
    setReducedMotion(true);
    const { container } = render(<V4Diferencial {...FOUNDERS_WITH_VIDEO} />);
    expect(
      container.querySelectorAll("img[data-asset-type='founder-portrait']")
    ).toHaveLength(2);
    expect(
      container.querySelectorAll(
        "video[data-asset-type='founder-portrait-video']"
      )
    ).toHaveLength(0);
  });

  test("video onError logs and leaves the element mounted so poster keeps showing", () => {
    // The browser renders the `poster` image as long as the <video> is in
    // the DOM. Hiding the element on error would defeat the graceful
    // fallback. We log the error but otherwise let the browser handle it.
    const errSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const { container } = render(<V4Diferencial {...FOUNDERS_WITH_VIDEO} />);
    const video = container.querySelector(
      "video[data-asset-type='founder-portrait-video']"
    ) as HTMLVideoElement;
    fireEvent.error(video);
    expect(errSpy).toHaveBeenCalled();
    expect(errSpy.mock.calls[0][0]).toContain("Video for");
    expect(video.style.display).not.toBe("none");
    expect(video.isConnected).toBe(true);
    expect(video.getAttribute("poster")).toBe(
      FOUNDERS_WITH_VIDEO.founderA.portraitUrl
    );
    errSpy.mockRestore();
  });
});
