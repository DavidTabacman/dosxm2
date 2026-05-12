import { expect, test, describe, vi, beforeEach, afterEach } from "vitest";
import { render, fireEvent, act } from "@testing-library/react";
import V4StickyHeader, {
  V4_NAV_LINKS,
  resolveNavHref,
} from "@/components/v4/V4StickyHeader";
import { readV4Css } from "../utils/readCss";
import { extractRuleBody, assertMinTapTarget } from "../utils/touchTargets";

// Mutable router-state shim — each test sets pathname/push before render.
const routerState: {
  pathname: string;
  asPath: string;
  push: ReturnType<typeof vi.fn>;
  replace: ReturnType<typeof vi.fn>;
} = {
  pathname: "/v4",
  asPath: "/v4",
  push: vi.fn(),
  replace: vi.fn(),
};

vi.mock("next/router", () => ({
  useRouter: () => routerState,
}));

// jsdom doesn't implement scrollIntoView — stub it so nav clicks don't crash.
beforeEach(() => {
  Element.prototype.scrollIntoView = vi.fn();
  routerState.pathname = "/v4";
  routerState.asPath = "/v4";
  routerState.push = vi.fn();
  routerState.replace = vi.fn();
});

afterEach(() => {
  vi.restoreAllMocks();
  // Reset body styles touched by the scroll-lock effect so tests don't leak
  // into each other.
  const b = document.body.style;
  b.position = "";
  b.top = "";
  b.left = "";
  b.right = "";
  b.overflow = "";
});

describe("V4 StickyHeader", () => {
  test("exports 7 nav links: 5 anchors + Conócenos page + Valorador external", () => {
    expect(V4_NAV_LINKS).toHaveLength(7);
    const anchors = V4_NAV_LINKS.filter((l) => l.kind === "anchor").map(
      (l) => l.href
    );
    expect(anchors).toEqual([
      "#diferencial",
      "#resultados",
      "#historias",
      "#resenas",
      "#contacto",
    ]);
    const pageLinks = V4_NAV_LINKS.filter((l) => l.kind === "page");
    expect(pageLinks).toHaveLength(1);
    expect(pageLinks[0].href).toBe("/v4/conocenos");
    expect(pageLinks[0].label).toBe("Conócenos");
    const external = V4_NAV_LINKS.filter((l) => l.kind === "external");
    expect(external).toHaveLength(1);
    expect(external[0].label).toBe("Valorador");
    expect(external[0].href).toContain("valuation.lystos.com");
  });

  test("Valorador external nav link opens in a new tab with safe rel attrs", () => {
    const { container } = render(<V4StickyHeader />);
    const valorador = Array.from(container.querySelectorAll("nav a")).find(
      (a) => a.textContent?.trim() === "Valorador",
    );
    expect(valorador).not.toBeUndefined();
    expect(valorador?.getAttribute("target")).toBe("_blank");
    const rel = valorador?.getAttribute("rel") ?? "";
    expect(rel).toContain("noopener");
    expect(rel).toContain("noreferrer");
  });

  test("Conócenos page link routes via router.push (no scrollIntoView)", () => {
    const scrollSpy = vi.spyOn(Element.prototype, "scrollIntoView");
    const { container } = render(<V4StickyHeader />);
    const conocenos = Array.from(container.querySelectorAll("nav a")).find(
      (a) => a.textContent?.trim() === "Conócenos"
    ) as HTMLAnchorElement;
    expect(conocenos).not.toBeUndefined();
    expect(conocenos.getAttribute("href")).toBe("/v4/conocenos");
    fireEvent.click(conocenos);
    expect(routerState.push).toHaveBeenCalledWith("/v4/conocenos");
    expect(scrollSpy).not.toHaveBeenCalled();
  });

  test("when on /v4/conocenos, anchor link hrefs are rewritten to /v4#...", () => {
    routerState.pathname = "/v4/conocenos";
    routerState.asPath = "/v4/conocenos";
    const { container } = render(<V4StickyHeader />);
    const diferencial = Array.from(container.querySelectorAll("nav a")).find(
      (a) => a.textContent?.trim() === "Por qué elegirnos"
    ) as HTMLAnchorElement;
    expect(diferencial.getAttribute("href")).toBe("/v4#diferencial");
  });

  test("cross-page anchor click does NOT preventDefault (browser handles full-page nav)", () => {
    routerState.pathname = "/v4/conocenos";
    const { container } = render(<V4StickyHeader />);
    const diferencial = Array.from(container.querySelectorAll("nav a")).find(
      (a) => a.textContent?.trim() === "Por qué elegirnos"
    ) as HTMLAnchorElement;
    const ev = new MouseEvent("click", { bubbles: true, cancelable: true });
    diferencial.dispatchEvent(ev);
    expect(ev.defaultPrevented).toBe(false);
    expect(routerState.push).not.toHaveBeenCalled();
  });

  test("resolveNavHref keeps anchor href bare on /v4, prefixes elsewhere", () => {
    const anchor = V4_NAV_LINKS.find((l) => l.kind === "anchor")!;
    expect(resolveNavHref(anchor, "/v4")).toBe(anchor.href);
    expect(resolveNavHref(anchor, "/v4/conocenos")).toBe(
      "/v4" + anchor.href
    );
    expect(resolveNavHref(anchor, "/")).toBe("/v4" + anchor.href);
    const pageLink = V4_NAV_LINKS.find((l) => l.kind === "page")!;
    expect(resolveNavHref(pageLink, "/v4/conocenos")).toBe(pageLink.href);
    expect(resolveNavHref(pageLink, "/v4")).toBe(pageLink.href);
  });

  test("renders the DOSXM2 logo button", () => {
    const { container } = render(<V4StickyHeader />);
    const logo = container.querySelector("button[aria-label*='DOSXM2']");
    expect(logo).not.toBeNull();
    const logoImage = logo?.querySelector("img");
    expect(logoImage).not.toBeNull();
    expect(logoImage?.getAttribute("alt")).toContain("DOSXM2");
  });

  test("renders all nav link anchors in desktop nav", () => {
    const { container } = render(<V4StickyHeader />);
    const nav = container.querySelector("nav");
    expect(nav).not.toBeNull();
    const links = nav?.querySelectorAll("a") ?? [];
    expect(links.length).toBe(V4_NAV_LINKS.length);
    V4_NAV_LINKS.forEach((l, i) => {
      expect(links[i].getAttribute("href")).toBe(l.href);
      expect(links[i].textContent).toBe(l.label);
    });
  });

  test("nav click calls scrollIntoView on the target section", () => {
    // Insert an actual target section so querySelector finds it.
    const section = document.createElement("section");
    section.id = "diferencial";
    document.body.appendChild(section);

    const spy = vi.spyOn(section, "scrollIntoView");

    const { container } = render(<V4StickyHeader />);
    const link = container.querySelector("nav a[href='#diferencial']")!;
    fireEvent.click(link);

    expect(spy).toHaveBeenCalledWith({ behavior: "smooth", block: "start" });

    document.body.removeChild(section);
  });

  test("falls back to solid state when IntersectionObserver is unavailable", () => {
    // jsdom ships without IO by default; component should default to solid.
    const { container } = render(<V4StickyHeader />);
    const header = container.querySelector("header");
    expect(header?.getAttribute("data-solid")).toBe("true");
  });

  test("mobile menu toggle opens and closes the drawer", () => {
    const { container } = render(<V4StickyHeader />);
    const toggle = container.querySelector(
      "button[aria-label='Abrir menú']"
    ) as HTMLButtonElement | null;
    expect(toggle).not.toBeNull();
    expect(toggle?.getAttribute("aria-expanded")).toBe("false");

    fireEvent.click(toggle!);
    expect(toggle?.getAttribute("aria-expanded")).toBe("true");
    expect(toggle?.getAttribute("aria-label")).toBe("Cerrar menú");

    fireEvent.click(toggle!);
    expect(toggle?.getAttribute("aria-expanded")).toBe("false");
  });

  test("ESC key closes the mobile drawer", () => {
    const { container } = render(<V4StickyHeader />);
    const toggle = container.querySelector(
      "button[aria-label='Abrir menú']"
    ) as HTMLButtonElement | null;
    fireEvent.click(toggle!);
    expect(toggle?.getAttribute("aria-expanded")).toBe("true");

    act(() => {
      fireEvent.keyDown(document, { key: "Escape" });
    });
    expect(toggle?.getAttribute("aria-expanded")).toBe("false");
  });

  test("drawer backdrop click closes the menu", () => {
    const { container } = render(<V4StickyHeader />);
    const toggle = container.querySelector(
      "button[aria-label='Abrir menú']"
    ) as HTMLButtonElement;
    fireEvent.click(toggle);

    const backdrop = container.querySelector("[class*='drawerBackdropOpen']");
    expect(backdrop).not.toBeNull();
    fireEvent.click(backdrop!);
    expect(toggle.getAttribute("aria-expanded")).toBe("false");
  });

  test("drawer contains matching nav links, tabIndex=-1 when closed", () => {
    const { container } = render(<V4StickyHeader />);
    const drawer = container.querySelector("[id='v4-mobile-drawer']");
    expect(drawer).not.toBeNull();
    const drawerLinks = drawer!.querySelectorAll("a[class*='navLink']");
    expect(drawerLinks.length).toBe(V4_NAV_LINKS.length);
    drawerLinks.forEach((a) => {
      expect(a.getAttribute("tabindex")).toBe("-1");
    });
  });

  test("drawer links become tabbable after opening", () => {
    const { container } = render(<V4StickyHeader />);
    const toggle = container.querySelector(
      "button[aria-label='Abrir menú']"
    ) as HTMLButtonElement;
    fireEvent.click(toggle);

    const drawer = container.querySelector("[id='v4-mobile-drawer']");
    const drawerLinks = drawer!.querySelectorAll("a[class*='navLink']");
    drawerLinks.forEach((a) => {
      expect(a.getAttribute("tabindex")).toBe("0");
    });
  });

  test("logo click calls window.scrollTo(0, 0)", () => {
    const scrollSpy = vi.spyOn(window, "scrollTo");
    const { container } = render(<V4StickyHeader />);
    const logo = container.querySelector(
      "button[aria-label*='DOSXM2']"
    ) as HTMLButtonElement;
    fireEvent.click(logo);
    // window.scrollTo accepts an options object in the component
    expect(scrollSpy).toHaveBeenCalled();
  });

  test("has role=banner (landmark) and aria-label on navigation", () => {
    const { container } = render(<V4StickyHeader />);
    const header = container.querySelector("header[role='banner']");
    expect(header).not.toBeNull();

    const nav = container.querySelector("nav");
    expect(nav?.getAttribute("aria-label")).toBe("Navegación principal");
  });

  test(".iconLink meets 44x44 tap target (header + drawer socials)", () => {
    const css = readV4Css("V4StickyHeader.module.css");
    const body = extractRuleBody(css, [".iconLink"]);
    assertMinTapTarget(body, ".iconLink");
  });

  test("opening the drawer applies iOS-safe fixed-position body lock", () => {
    // Simulate a scrolled page so the lock has something to preserve.
    Object.defineProperty(window, "scrollY", { value: 320, configurable: true });
    const { container } = render(<V4StickyHeader />);
    const toggle = container.querySelector(
      "button[aria-label='Abrir menú']"
    ) as HTMLButtonElement;

    fireEvent.click(toggle);

    expect(document.body.style.position).toBe("fixed");
    expect(document.body.style.top).toBe("-320px");
    expect(document.body.style.overflow).toBe("hidden");
  });

  test("closing the drawer restores body styles and scroll position", () => {
    Object.defineProperty(window, "scrollY", { value: 180, configurable: true });
    const scrollSpy = vi.spyOn(window, "scrollTo");
    const { container } = render(<V4StickyHeader />);
    const toggle = container.querySelector(
      "button[aria-label='Abrir menú']"
    ) as HTMLButtonElement;

    fireEvent.click(toggle); // open
    fireEvent.click(toggle); // close

    expect(document.body.style.position).toBe("");
    expect(document.body.style.top).toBe("");
    expect(scrollSpy).toHaveBeenCalledWith(0, 180);
  });

  test("drawer nav-link defers scrollIntoView until body is unfixed (P1-10 regression guard)", () => {
    vi.useFakeTimers();
    Object.defineProperty(window, "scrollY", { value: 500, configurable: true });
    const section = document.createElement("section");
    section.id = "diferencial";
    document.body.appendChild(section);
    const spy = vi.spyOn(section, "scrollIntoView");

    const { container } = render(<V4StickyHeader />);
    const toggle = container.querySelector(
      "button[aria-label='Abrir menú']"
    ) as HTMLButtonElement;
    fireEvent.click(toggle);
    expect(document.body.style.position).toBe("fixed");

    // Click the drawer's nav link (the one inside #v4-mobile-drawer).
    const drawer = container.querySelector("[id='v4-mobile-drawer']");
    const drawerLink = drawer!.querySelector(
      "a[href='#diferencial']"
    ) as HTMLAnchorElement;
    fireEvent.click(drawerLink);

    // Body must be unfixed BEFORE scrollIntoView is called (otherwise the
    // scroll silently no-ops and the cleanup's scrollTo(0,500) stranded us).
    expect(document.body.style.position).toBe("");
    expect(spy).not.toHaveBeenCalled();

    // Flush the deferred scrollIntoView — rAF in jsdom is a setTimeout(16).
    vi.advanceTimersByTime(20);
    expect(spy).toHaveBeenCalledWith({ behavior: "smooth", block: "start" });

    document.body.removeChild(section);
    vi.useRealTimers();
  });

  test("logo click from open drawer defers scroll-to-top the same way", () => {
    vi.useFakeTimers();
    Object.defineProperty(window, "scrollY", { value: 240, configurable: true });
    const scrollSpy = vi.spyOn(window, "scrollTo");
    const { container } = render(<V4StickyHeader />);
    const toggle = container.querySelector(
      "button[aria-label='Abrir menú']"
    ) as HTMLButtonElement;
    fireEvent.click(toggle); // open drawer

    const logo = container.querySelector(
      "button[aria-label*='DOSXM2']"
    ) as HTMLButtonElement;
    fireEvent.click(logo);

    // Cleanup should have restored scroll to the pre-open position (240).
    expect(scrollSpy).toHaveBeenCalledWith(0, 240);
    // But the "go to top" smooth scroll must not fire until rAF flushes.
    const preFlushCalls = scrollSpy.mock.calls.length;

    vi.advanceTimersByTime(20);
    // Now the deferred smooth scroll-to-top fires.
    const postFlushCalls = scrollSpy.mock.calls.length;
    expect(postFlushCalls).toBeGreaterThan(preFlushCalls);
    const last = scrollSpy.mock.calls[scrollSpy.mock.calls.length - 1];
    expect(last[0]).toEqual({ top: 0, behavior: "smooth" });
    vi.useRealTimers();
  });
});
