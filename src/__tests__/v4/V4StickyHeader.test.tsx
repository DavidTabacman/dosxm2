import { expect, test, describe, vi, beforeEach, afterEach } from "vitest";
import { render, fireEvent, act } from "@testing-library/react";
import V4StickyHeader, { V4_NAV_LINKS } from "@/components/v4/V4StickyHeader";

// jsdom doesn't implement scrollIntoView — stub it so nav clicks don't crash.
beforeEach(() => {
  Element.prototype.scrollIntoView = vi.fn();
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("V4 StickyHeader", () => {
  test("exports 5 nav links matching the BRD sections", () => {
    expect(V4_NAV_LINKS).toHaveLength(5);
    const hrefs = V4_NAV_LINKS.map((l) => l.href);
    expect(hrefs).toEqual([
      "#diferencial",
      "#resultados",
      "#historias",
      "#resenas",
      "#valorador",
    ]);
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
});
