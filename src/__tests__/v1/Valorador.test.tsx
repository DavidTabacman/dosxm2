import { expect, test, describe } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import Valorador from "@/components/v1/Valorador";

describe("V1 Valorador", () => {
  test("renders heading '¿Cuánto vale tu historia?'", () => {
    const { container } = render(<Valorador />);
    expect(container.textContent).toContain("¿Cuánto vale tu historia?");
  });

  test("renders all 5 form fields", () => {
    const { container } = render(<Valorador />);
    const labels = ["Dirección", "Metros cuadrados", "Habitaciones", "Tu nombre", "Tu teléfono"];
    for (const label of labels) {
      expect(container.textContent).toContain(label);
    }
  });

  test("renders 5 input elements", () => {
    const { container } = render(<Valorador />);
    const inputs = container.querySelectorAll("input");
    expect(inputs).toHaveLength(5);
  });

  test("all inputs are required", () => {
    const { container } = render(<Valorador />);
    const inputs = container.querySelectorAll("input");
    inputs.forEach((input) => {
      expect(input.hasAttribute("required")).toBe(true);
    });
  });

  test("phone field has type='tel'", () => {
    const { container } = render(<Valorador />);
    const telInput = container.querySelector("input[type='tel']");
    expect(telInput).not.toBeNull();
  });

  test("renders submit button 'Solicitar valoración'", () => {
    const { container } = render(<Valorador />);
    const button = container.querySelector("button[type='submit']");
    expect(button?.textContent).toBe("Solicitar valoración");
  });

  test("shows success state after form submission", () => {
    const { container } = render(<Valorador />);
    const form = container.querySelector("form")!;
    fireEvent.submit(form);
    expect(container.textContent).toContain("¡Gracias! Te contactaremos pronto.");
    expect(container.textContent).toContain("menos de 24 horas");
  });

  test("success state shows checkmark", () => {
    const { container } = render(<Valorador />);
    const form = container.querySelector("form")!;
    fireEvent.submit(form);
    const check = container.querySelector("[aria-hidden='true']");
    expect(check?.textContent).toContain("✓");
  });
});
