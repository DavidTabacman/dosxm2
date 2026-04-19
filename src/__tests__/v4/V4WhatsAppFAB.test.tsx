import { expect, test, describe, vi, beforeEach, afterEach } from "vitest";
import { render, act, fireEvent } from "@testing-library/react";
import V4WhatsAppFAB from "@/components/v4/V4WhatsAppFAB";

const DEFAULT_PROPS = {
  phone: "34600123456",
  message: "Hola DOSXM2",
  portraitAUrl: "https://example.com/a.jpg",
  portraitAAlt: "Retrato A",
  portraitBUrl: "https://example.com/b.jpg",
  portraitBAlt: "Retrato B",
  label: "WhatsApp",
};

describe("V4 WhatsAppFAB", () => {
  let anchor: HTMLElement;

  beforeEach(() => {
    vi.useFakeTimers();
    // Component observes the anchor section — tests need one to exist so
    // the IO fallback path picks `visible=true`. We inject + clean up.
    anchor = document.createElement("section");
    anchor.id = "diferencial";
    document.body.appendChild(anchor);
  });

  afterEach(() => {
    vi.useRealTimers();
    if (anchor.parentNode) anchor.parentNode.removeChild(anchor);
  });

  test("renders a link with a wa.me URL including the phone", () => {
    const { container } = render(<V4WhatsAppFAB {...DEFAULT_PROPS} />);
    const link = container.querySelector("a");
    expect(link).not.toBeNull();
    expect(link?.getAttribute("href")).toContain("https://wa.me/34600123456");
  });

  test("encodes the prefilled message in the wa.me URL", () => {
    const { container } = render(<V4WhatsAppFAB {...DEFAULT_PROPS} />);
    const href = container.querySelector("a")?.getAttribute("href") ?? "";
    expect(href).toContain("text=");
    expect(href).toContain(encodeURIComponent("Hola DOSXM2"));
  });

  test("strips non-digit characters from the phone", () => {
    const { container } = render(
      <V4WhatsAppFAB {...DEFAULT_PROPS} phone="+34 (600) 123-456" />
    );
    const href = container.querySelector("a")?.getAttribute("href") ?? "";
    expect(href).toContain("https://wa.me/34600123456");
  });

  test("renders two portrait images with correct alt text", () => {
    const { container } = render(<V4WhatsAppFAB {...DEFAULT_PROPS} />);
    const portraits = container.querySelectorAll(
      "img[data-asset-type='founder-portrait']"
    );
    expect(portraits).toHaveLength(2);
    expect(portraits[0].getAttribute("alt")).toBe("Retrato A");
    expect(portraits[1].getAttribute("alt")).toBe("Retrato B");
  });

  test("FAB is hidden before mount delay (armed flag false)", () => {
    const { container } = render(<V4WhatsAppFAB {...DEFAULT_PROPS} />);
    // Immediately after render, armed is false → aria-hidden=true
    const wrapper = container.firstElementChild as HTMLElement;
    expect(wrapper.getAttribute("aria-hidden")).toBe("true");
  });

  test("FAB becomes visible after mount delay (IO-unsupported fallback)", () => {
    // In jsdom IO is undefined → defaults to visible=true → after 100ms arm
    // delay the FAB should no longer be aria-hidden.
    const { container } = render(<V4WhatsAppFAB {...DEFAULT_PROPS} />);
    act(() => {
      vi.advanceTimersByTime(200);
    });
    const wrapper = container.firstElementChild as HTMLElement;
    expect(wrapper.getAttribute("aria-hidden")).toBe("false");
  });

  test("portraits hide on image error (graceful degradation)", () => {
    const { container } = render(<V4WhatsAppFAB {...DEFAULT_PROPS} />);
    const portrait = container.querySelector(
      "img[data-asset-type='founder-portrait']"
    ) as HTMLImageElement;
    fireEvent.error(portrait);
    expect(portrait.style.visibility).toBe("hidden");
  });

  test("link has target=_blank and rel=noopener noreferrer for security", () => {
    const { container } = render(<V4WhatsAppFAB {...DEFAULT_PROPS} />);
    const link = container.querySelector("a")!;
    expect(link.getAttribute("target")).toBe("_blank");
    expect(link.getAttribute("rel")).toBe("noopener noreferrer");
  });

  test("link tabIndex is -1 while hidden, 0 when visible", () => {
    const { container } = render(<V4WhatsAppFAB {...DEFAULT_PROPS} />);
    const link = container.querySelector("a")!;
    expect(link.getAttribute("tabindex")).toBe("-1");

    act(() => {
      vi.advanceTimersByTime(200);
    });
    expect(link.getAttribute("tabindex")).toBe("0");
  });

  test("no message prop renders a URL without text= parameter", () => {
    const { container } = render(
      <V4WhatsAppFAB {...DEFAULT_PROPS} message={undefined} />
    );
    const href = container.querySelector("a")?.getAttribute("href") ?? "";
    expect(href).toBe("https://wa.me/34600123456");
  });
});

/**
 * IO-path tests: the production logic uses IntersectionObserver to only show
 * the FAB AFTER the user has scrolled past the anchor section (BRD 4.2).
 * jsdom has no IO, so we provide a controllable fake here.
 */
describe("V4 WhatsAppFAB (IntersectionObserver path)", () => {
  let anchor: HTMLElement;
  let ioCallback: IntersectionObserverCallback | null = null;
  let fakeObserver: { observe: ReturnType<typeof vi.fn>; disconnect: ReturnType<typeof vi.fn>; unobserve: ReturnType<typeof vi.fn> };
  let OriginalIO: typeof IntersectionObserver | undefined;

  beforeEach(() => {
    vi.useFakeTimers();
    anchor = document.createElement("section");
    anchor.id = "diferencial";
    document.body.appendChild(anchor);

    OriginalIO = (globalThis as { IntersectionObserver?: typeof IntersectionObserver }).IntersectionObserver;
    fakeObserver = {
      observe: vi.fn(),
      disconnect: vi.fn(),
      unobserve: vi.fn(),
    };
    // Must be a real constructor — the component calls `new IntersectionObserver(...)`.
    class FakeIO {
      constructor(cb: IntersectionObserverCallback) {
        ioCallback = cb;
      }
      observe = fakeObserver.observe;
      disconnect = fakeObserver.disconnect;
      unobserve = fakeObserver.unobserve;
      takeRecords = () => [];
      root = null;
      rootMargin = "";
      thresholds: ReadonlyArray<number> = [];
    }
    (globalThis as { IntersectionObserver: unknown }).IntersectionObserver =
      FakeIO as unknown as typeof IntersectionObserver;
  });

  afterEach(() => {
    vi.useRealTimers();
    if (anchor.parentNode) anchor.parentNode.removeChild(anchor);
    ioCallback = null;
    (globalThis as { IntersectionObserver?: typeof IntersectionObserver }).IntersectionObserver = OriginalIO;
  });

  function fireIntersection(bottom: number, isIntersecting: boolean) {
    if (!ioCallback) throw new Error("IO callback not captured");
    const entry = {
      boundingClientRect: { bottom } as DOMRectReadOnly,
      isIntersecting,
      target: anchor,
    } as unknown as IntersectionObserverEntry;
    ioCallback([entry], fakeObserver as unknown as IntersectionObserver);
  }

  test("FAB stays hidden when anchor is BELOW viewport (initial hero load)", () => {
    const { container } = render(<V4WhatsAppFAB {...DEFAULT_PROPS} />);
    act(() => {
      // Arming delay complete
      vi.advanceTimersByTime(200);
      // Simulate initial IO fire: anchor is below viewport (bottom > 0)
      fireIntersection(1200, false);
    });
    const wrapper = container.firstElementChild as HTMLElement;
    expect(wrapper.getAttribute("aria-hidden")).toBe("true");
  });

  test("FAB stays hidden while anchor is IN viewport", () => {
    const { container } = render(<V4WhatsAppFAB {...DEFAULT_PROPS} />);
    act(() => {
      vi.advanceTimersByTime(200);
      fireIntersection(400, true);
    });
    const wrapper = container.firstElementChild as HTMLElement;
    expect(wrapper.getAttribute("aria-hidden")).toBe("true");
  });

  test("FAB becomes visible after user scrolls PAST the anchor (bottom <= 0)", () => {
    const { container } = render(<V4WhatsAppFAB {...DEFAULT_PROPS} />);
    act(() => {
      vi.advanceTimersByTime(200);
      fireIntersection(-50, false);
    });
    const wrapper = container.firstElementChild as HTMLElement;
    expect(wrapper.getAttribute("aria-hidden")).toBe("false");
  });

  test("FAB hides again when user scrolls back up to the anchor", () => {
    const { container } = render(<V4WhatsAppFAB {...DEFAULT_PROPS} />);
    act(() => {
      vi.advanceTimersByTime(200);
      // Scroll past → visible
      fireIntersection(-50, false);
    });
    expect(
      (container.firstElementChild as HTMLElement).getAttribute("aria-hidden")
    ).toBe("false");

    act(() => {
      // Scroll back up — anchor re-enters viewport
      fireIntersection(300, true);
    });
    expect(
      (container.firstElementChild as HTMLElement).getAttribute("aria-hidden")
    ).toBe("true");
  });

  test("disconnect runs on unmount (no leaked observer)", () => {
    const { unmount } = render(<V4WhatsAppFAB {...DEFAULT_PROPS} />);
    unmount();
    expect(fakeObserver.disconnect).toHaveBeenCalled();
  });
});
