import { describe, expect, test, vi } from "vitest";
import { render } from "@testing-library/react";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import V4ConocenosPage from "@/pages/conocenos";

vi.mock("next/font/google", () => {
  const stubFont = () => ({
    variable: "--font-stub",
    className: "font-stub",
    style: { fontFamily: "stub" },
  });
  return { Fraunces: stubFont, Inter: stubFont };
});

vi.mock("next/head", () => {
  return {
    default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  };
});

vi.mock("next/router", () => ({
  useRouter: () => ({
    pathname: "/conocenos",
    asPath: "/conocenos",
    query: {},
    push: vi.fn(),
    replace: vi.fn(),
    isReady: true,
  }),
}));

vi.mock("@/components/shared/useSectionReveal", () => ({
  useSectionReveal: () => [() => {}, true],
}));

vi.mock("@/components/shared/useSectionVisible", () => ({
  useSectionVisible: () => [() => {}, true],
}));

describe("V4 ConocenosPage — integration", () => {
  test("mounts without throwing", () => {
    expect(() => render(<V4ConocenosPage />)).not.toThrow();
  });

  test("renders exactly one <header role='banner'> (sticky header)", () => {
    const { container } = render(<V4ConocenosPage />);
    const headers = container.querySelectorAll("header[role='banner']");
    expect(headers).toHaveLength(1);
  });

  test("renders all three Conócenos section ids", () => {
    const { container } = render(<V4ConocenosPage />);
    // jsdom + CSS-modules occasionally mis-resolves "section#id" selectors —
    // use attribute selector, same pattern as V4Page.test.tsx.
    expect(container.querySelector("section[id='pablo']")).not.toBeNull();
    expect(container.querySelector("section[id='borja']")).not.toBeNull();
    expect(container.querySelector("section[id='juntos']")).not.toBeNull();
  });

  test("emits exactly one <h1> and (3 acts + 1 footer logo) <h2>", () => {
    const { container } = render(<V4ConocenosPage />);
    expect(container.querySelectorAll("h1")).toHaveLength(1);
    // Three Conócenos act headings inside <main>:
    const main = container.querySelector("main[id='conocenos-main']");
    expect(main).not.toBeNull();
    expect(main!.querySelectorAll("h2")).toHaveLength(3);
    // Plus the footer's branding h2 (DOSXM2 logo) — that's intentional.
    const footer = container.querySelector("footer[role='contentinfo']");
    expect(footer?.querySelectorAll("h2").length).toBe(1);
  });

  test("does NOT mount the WhatsApp FAB", () => {
    const { container } = render(<V4ConocenosPage />);
    // The FAB renders a fixed wrapper carrying its own data attr; no
    // selector for it should match.
    expect(
      container.querySelector("[data-testid='v4-whatsapp-fab']")
    ).toBeNull();
  });

  test("renders the V4Footer (DOSXM2 contentinfo landmark)", () => {
    const { container } = render(<V4ConocenosPage />);
    const footer = container.querySelector("footer[role='contentinfo']");
    expect(footer).not.toBeNull();
    expect(footer?.textContent).toContain("DOSXM2");
  });

  test("Pablo's portrait is preloaded as an LCP candidate", () => {
    render(<V4ConocenosPage />);
    // React 19 hoists <link rel="preload"> into document.head; the next/head
    // mock renders children as a fragment, so they land there too. Match
    // by href directly to avoid picking up Next.js framework preloads (which
    // also use as="image" but for routing thumbnails).
    const preloads = [
      ...document.head.querySelectorAll("link[rel='preload']"),
      ...document.querySelectorAll("link[rel='preload']"),
    ];
    const pabloPreload = preloads.find(
      (link) => link.getAttribute("href") === "/v4/founders/founder_pablo.webp"
    );
    expect(pabloPreload).toBeDefined();
    expect(pabloPreload?.getAttribute("as")).toBe("image");
    expect(pabloPreload?.getAttribute("type")).toBe("image/webp");
  });

  test("page metadata: title, description, canonical, OG image", () => {
    render(<V4ConocenosPage />);
    const title =
      document.head.querySelector("title") ?? document.querySelector("title");
    expect(title?.textContent).toContain("Conócenos");
    expect(title?.textContent).toContain("DOSXM2");
    const description =
      document.head.querySelector("meta[name='description']") ??
      document.querySelector("meta[name='description']");
    expect(description?.getAttribute("content")).toContain("Pablo");
    expect(description?.getAttribute("content")).toContain("Borja");
    // SEO audit §4.2: canonical and OG image must be ABSOLUTE URLs (relative
    // ones are ignored by Google). The <Seo> component prefixes SITE_ORIGIN.
    const canonical =
      document.head.querySelector("link[rel='canonical']") ??
      document.querySelector("link[rel='canonical']");
    expect(canonical?.getAttribute("href")).toMatch(
      /^https?:\/\/.+\/conocenos$/
    );
    const ogImage =
      document.head.querySelector("meta[property='og:image']") ??
      document.querySelector("meta[property='og:image']");
    expect(ogImage?.getAttribute("content")).toMatch(
      /^https?:\/\/.+\/v4\/founders\/together\.webp$/
    );
  });

  test("viewport meta includes viewport-fit=cover (notched-device safe-area)", () => {
    render(<V4ConocenosPage />);
    const viewport =
      document.head.querySelector("meta[name='viewport']") ??
      document.querySelector("meta[name='viewport']");
    expect(viewport).not.toBeNull();
    expect(viewport?.getAttribute("content")).toContain("viewport-fit=cover");
  });

  test("closing CTA links to /#contacto (back to homepage contact)", () => {
    const { container } = render(<V4ConocenosPage />);
    const juntos = container.querySelector("section[id='juntos']");
    expect(juntos).not.toBeNull();
    const cta = juntos!.querySelector(
      "a[class*='cta']"
    ) as HTMLAnchorElement | null;
    expect(cta).not.toBeNull();
    expect(cta!.getAttribute("href")).toBe("/#contacto");
  });

  test("verbatim BRD §6 copy lands (sample sentences)", () => {
    const { container } = render(<V4ConocenosPage />);
    const text = container.textContent ?? "";
    expect(text).toContain("Banfield");
    expect(text).toContain("Universidad de Ciencias Económicas");
    expect(text).toContain("Getafe");
    expect(text).toContain("Saint-Gobain");
    expect(text).toContain("¿Por qué nos unimos?");
    expect(text).toContain("equipo que funciona como uno solo");
  });

  test("source loads Fraunces with weight ['400'] (matches /v4 typography)", () => {
    const src = readFileSync(
      resolve(process.cwd(), "src/pages/conocenos.tsx"),
      "utf8"
    );
    expect(src).toMatch(/Fraunces\(\s*{[^}]*weight:\s*\[\s*"400"\s*\]/);
  });
});
