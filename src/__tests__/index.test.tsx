import { expect, test, describe, vi, beforeEach, afterEach } from "vitest";
import { render } from "@testing-library/react";
import Home from "@/pages/index";

vi.mock("next/font/google", () => {
  const stubFont = () => ({
    variable: "--font-stub",
    className: "font-stub",
    style: { fontFamily: "stub" },
  });
  return { Fraunces: stubFont, Inter: stubFont };
});

vi.mock("next/head", () => ({
  default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

vi.mock("next/router", () => ({
  useRouter: () => ({
    pathname: "/",
    asPath: "/",
    query: {},
    push: vi.fn(),
    replace: vi.fn(),
    isReady: true,
  }),
}));

// embla-carousel (V5Historias) constructs IntersectionObserver and ResizeObserver
// unconditionally on mount; jsdom provides neither, so stub no-ops to let the full
// page render. (These are stubbed locally rather than in setup.ts because other
// suites assert the components' no-observer fallback paths.)
class ObserverStub {
  root = null;
  rootMargin = "";
  thresholds = [];
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return [];
  }
}

describe("Homepage (V5)", () => {
  beforeEach(() => {
    // jsdom doesn't implement scrollIntoView — stub so nav clicks don't crash.
    Element.prototype.scrollIntoView = vi.fn();
    vi.stubGlobal("IntersectionObserver", ObserverStub);
    vi.stubGlobal("ResizeObserver", ObserverStub);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  test("renders the sticky header as a banner landmark", () => {
    const { container } = render(<Home />);
    expect(container.querySelector("header[role='banner']")).not.toBeNull();
  });

  test("renders the footer as a contentinfo landmark", () => {
    const { container } = render(<Home />);
    expect(container.querySelector("footer[role='contentinfo']")).not.toBeNull();
  });

  test("header 'Conócenos' link points to /conocenos", () => {
    const { container } = render(<Home />);
    const conocenos = Array.from(container.querySelectorAll("nav a")).find(
      (a) => a.textContent?.trim() === "Conócenos"
    );
    expect(conocenos?.getAttribute("href")).toBe("/conocenos");
  });
});
