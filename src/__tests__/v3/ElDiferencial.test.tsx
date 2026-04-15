import { expect, test, describe } from "vitest";
import { render } from "@testing-library/react";
import ElDiferencial from "@/components/v3/ElDiferencial";

describe("V3 ElDiferencial", () => {
  test("renders heading 'Dos visiones. Un objetivo.'", () => {
    const { container } = render(<ElDiferencial />);
    const h2 = container.querySelector("h2");
    expect(h2?.textContent).toBe("Dos visiones. Un objetivo.");
  });

  test("renders section label 'El Diferencial'", () => {
    const { container } = render(<ElDiferencial />);
    expect(container.textContent).toContain("El Diferencial");
  });

  test("renders 2 editorial images", () => {
    const { container } = render(<ElDiferencial />);
    const images = container.querySelectorAll("img");
    expect(images).toHaveLength(2);
  });

  test("images have descriptive alt text", () => {
    const { container } = render(<ElDiferencial />);
    const images = container.querySelectorAll("img");
    expect(images[0].getAttribute("alt")).toContain("DOSXM2");
    expect(images[1].getAttribute("alt")).toContain("propiedad");
  });

  test("images have data-asset-type attributes", () => {
    const { container } = render(<ElDiferencial />);
    const images = container.querySelectorAll("img");
    expect(images[0].getAttribute("data-asset-type")).toBe("editorial-portrait");
    expect(images[1].getAttribute("data-asset-type")).toBe("editorial-interior");
  });

  test("renders body text about the team", () => {
    const { container } = render(<ElDiferencial />);
    expect(container.textContent).toContain(
      "No somos una agencia tradicional."
    );
  });
});
