import { expect, test, describe, vi } from "vitest";
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
    expect(container.textContent).toContain("Dos visiones");
    expect(container.textContent).toContain("un único objetivo");
    expect(container.textContent).toContain("En un sector donde la mayoría trabaja solo");
    expect(container.textContent).toContain("nosotros somos un equipo");
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
});
