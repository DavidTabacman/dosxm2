import { expect, test, describe } from "vitest";
import { render } from "@testing-library/react";
import PruebaSocial from "@/components/v1/PruebaSocial";

describe("V1 PruebaSocial", () => {
  test("renders heading", () => {
    const { container } = render(<PruebaSocial />);
    const h2 = container.querySelector("h2");
    expect(h2?.textContent).toBe("Lo que dicen nuestros clientes.");
  });

  test("renders 3 testimonials as blockquotes", () => {
    const { container } = render(<PruebaSocial />);
    const quotes = container.querySelectorAll("blockquote");
    expect(quotes).toHaveLength(3);
  });

  test("renders testimonial content", () => {
    const { container } = render(<PruebaSocial />);
    expect(container.textContent).toContain(
      "Vendieron nuestro piso en 2 semanas"
    );
    expect(container.textContent).toContain("Nos acompañaron en cada paso");
    expect(container.textContent).toContain("Profesionalidad y cercanía");
  });

  test("renders author names with locations", () => {
    const { container } = render(<PruebaSocial />);
    expect(container.textContent).toContain("María y Carlos, Retiro");
    expect(container.textContent).toContain("Lucía Fernández, Chamberí");
    expect(container.textContent).toContain("Javier Ruiz, Salamanca");
  });

  test("renders section label 'Prueba Social'", () => {
    const { container } = render(<PruebaSocial />);
    expect(container.textContent).toContain("Prueba Social");
  });
});
