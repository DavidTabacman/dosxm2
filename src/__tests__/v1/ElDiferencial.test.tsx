import { expect, test, describe, vi } from "vitest";
import { render } from "@testing-library/react";
import ElDiferencial from "@/components/v1/ElDiferencial";

vi.mock("@/components/shared/useScrollProgress", () => ({
  useScrollProgress: () => 0,
}));

describe("V1 ElDiferencial", () => {
  test("renders heading 'Dos visiones. Un objetivo.'", () => {
    const { container } = render(<ElDiferencial />);
    const h2 = container.querySelector("h2");
    expect(h2?.textContent).toBe("Dos visiones. Un objetivo.");
  });

  test("renders body copy matching PRD", () => {
    const { container } = render(<ElDiferencial />);
    expect(container.textContent).toContain(
      "No somos una franquicia. No somos un algoritmo."
    );
    expect(container.textContent).toContain(
      "maximizar el valor de tu propiedad en Madrid"
    );
  });

  test("renders section label 'El Diferencial'", () => {
    const { container } = render(<ElDiferencial />);
    expect(container.textContent).toContain("El Diferencial");
  });

  test("renders 2 founder portrait images", () => {
    const { container } = render(<ElDiferencial />);
    const portraits = container.querySelectorAll("img[data-asset-type='portrait']");
    expect(portraits).toHaveLength(2);
  });

  test("portraits have alt text identifying founders", () => {
    const { container } = render(<ElDiferencial />);
    const portraits = container.querySelectorAll("img[data-asset-type='portrait']");
    expect(portraits[0].getAttribute("alt")).toContain("Fundador 1");
    expect(portraits[1].getAttribute("alt")).toContain("Fundador 2");
  });
});
