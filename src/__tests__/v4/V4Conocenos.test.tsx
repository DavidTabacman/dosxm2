import { describe, expect, test, vi } from "vitest";
import { render } from "@testing-library/react";
import V4Conocenos from "@/components/v4/V4Conocenos";
import { FOUNDER_BIOS } from "@/constants/founders";

vi.mock("@/components/shared/useSectionReveal", () => ({
  useSectionReveal: () => [() => {}, true],
}));

vi.mock("@/components/shared/useSectionVisible", () => ({
  useSectionVisible: () => [() => {}, true],
}));

describe("V4 Conocenos — orchestrator", () => {
  test("mounts inside a <main> with id 'conocenos-main'", () => {
    const { container } = render(<V4Conocenos />);
    const main = container.querySelector("main#conocenos-main");
    expect(main).not.toBeNull();
  });

  test("renders the page-level <h1>'Conócenos' once", () => {
    const { container } = render(<V4Conocenos />);
    const h1s = container.querySelectorAll("h1");
    expect(h1s).toHaveLength(1);
    expect(h1s[0].textContent).toContain("Conócenos");
  });

  test("renders all three section ids in order: #pablo, #borja, #juntos", () => {
    const { container } = render(<V4Conocenos />);
    const sections = Array.from(container.querySelectorAll("section[id]"));
    const ids = sections.map((s) => s.id);
    expect(ids).toEqual(["pablo", "borja", "juntos"]);
  });

  test("emits exactly three <h2> elements (one per act)", () => {
    const { container } = render(<V4Conocenos />);
    expect(container.querySelectorAll("h2")).toHaveLength(3);
  });

  test("Pablo's act gets isLcp (eager loading + high fetchpriority)", () => {
    const { container } = render(<V4Conocenos />);
    const pabloSection = container.querySelector("section[id='pablo']");
    const pabloImg = pabloSection?.querySelector<HTMLImageElement>(
      "img[data-asset-type='founder-portrait']"
    );
    expect(pabloImg?.getAttribute("loading")).toBe("eager");

    const borjaSection = container.querySelector("section[id='borja']");
    const borjaImg = borjaSection?.querySelector<HTMLImageElement>(
      "img[data-asset-type='founder-portrait']"
    );
    expect(borjaImg?.getAttribute("loading")).toBe("lazy");
  });

  test("Pablo bio is on the left, Borja bio on the right", () => {
    const { container } = render(<V4Conocenos />);
    expect(
      container.querySelector("section[id='pablo']")?.getAttribute("data-side")
    ).toBe("left");
    expect(
      container.querySelector("section[id='borja']")?.getAttribute("data-side")
    ).toBe("right");
  });

  test("each act renders its founder's intro line and at least one paragraph", () => {
    const { container } = render(<V4Conocenos />);
    expect(container.textContent).toContain(FOUNDER_BIOS.pablo.introLine);
    expect(container.textContent).toContain(FOUNDER_BIOS.borja.introLine);
    expect(container.textContent).toContain(
      FOUNDER_BIOS.pablo.paragraphs[0].slice(0, 20)
    );
    expect(container.textContent).toContain(
      FOUNDER_BIOS.borja.paragraphs[0].slice(0, 20)
    );
  });

  test("Juntos finale CTA points at /#contacto with label 'Hablemos'", () => {
    const { container } = render(<V4Conocenos />);
    const cta = container.querySelector(
      "section[id='juntos'] a[class*='cta']"
    ) as HTMLAnchorElement;
    expect(cta).not.toBeNull();
    expect(cta.getAttribute("href")).toBe("/#contacto");
    expect(cta.textContent).toContain("Hablemos");
  });
});
