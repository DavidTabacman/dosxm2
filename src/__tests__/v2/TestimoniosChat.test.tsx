import { expect, test, describe } from "vitest";
import { render } from "@testing-library/react";
import TestimoniosChat from "@/components/v2/TestimoniosChat";

describe("V2 TestimoniosChat", () => {
  test("renders heading", () => {
    const { container } = render(<TestimoniosChat />);
    const h2 = container.querySelector("h2");
    expect(h2?.textContent).toBe("Lo que nos dicen nuestros clientes.");
  });

  test("renders 3 chat bubbles", () => {
    const { container } = render(<TestimoniosChat />);
    const messages = [
      "¡Chicos, sois los mejores!",
      "Nos habéis cambiado la vida",
      "Profesionales de verdad",
    ];
    for (const msg of messages) {
      expect(container.textContent).toContain(msg);
    }
  });

  test("renders sender names with locations", () => {
    const { container } = render(<TestimoniosChat />);
    expect(container.textContent).toContain("Ana, Malasaña");
    expect(container.textContent).toContain("Pedro y Lucía, Chamberí");
    expect(container.textContent).toContain("Javier, Salamanca");
  });

  test("renders timestamps", () => {
    const { container } = render(<TestimoniosChat />);
    expect(container.textContent).toContain("14:32");
    expect(container.textContent).toContain("16:45");
    expect(container.textContent).toContain("10:15");
  });

  test("renders section label 'Prueba Social'", () => {
    const { container } = render(<TestimoniosChat />);
    expect(container.textContent).toContain("Prueba Social");
  });
});
