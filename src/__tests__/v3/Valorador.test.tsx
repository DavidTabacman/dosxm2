import { expect, test, describe } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import Valorador from "@/components/v3/Valorador";

describe("V3 Valorador", () => {
  test("renders heading 'Comencemos tu historia.'", () => {
    const { container } = render(<Valorador />);
    const h2 = container.querySelector("h2");
    expect(h2?.textContent).toBe("Comencemos tu historia.");
  });

  test("renders 3 form fields", () => {
    const { container } = render(<Valorador />);
    const inputs = container.querySelectorAll("input");
    expect(inputs).toHaveLength(3);
  });

  test("all inputs are required", () => {
    const { container } = render(<Valorador />);
    const inputs = container.querySelectorAll("input");
    inputs.forEach((input) => {
      expect(input.hasAttribute("required")).toBe(true);
    });
  });

  test("labels have correct htmlFor attributes", () => {
    const { container } = render(<Valorador />);
    const labels = container.querySelectorAll("label");
    expect(labels[0].getAttribute("for")).toBe("v3-nombre");
    expect(labels[1].getAttribute("for")).toBe("v3-telefono");
    expect(labels[2].getAttribute("for")).toBe("v3-direccion");
  });

  test("submit button contains 'Enviar'", () => {
    const { container } = render(<Valorador />);
    const button = container.querySelector("button[type='submit']");
    expect(button?.textContent).toContain("Enviar");
  });

  test("shows success message after valid submission", () => {
    const { container } = render(<Valorador />);
    const inputs = container.querySelectorAll("input");
    const form = container.querySelector("form")!;

    // Fill all fields with valid data
    fireEvent.change(inputs[0], { target: { value: "Juan" } });
    fireEvent.change(inputs[1], { target: { value: "612345678" } });
    fireEvent.change(inputs[2], { target: { value: "Calle Mayor 10" } });

    // Submit
    fireEvent.submit(form);

    expect(container.textContent).toContain("Gracias. Tu historia comienza aquí.");
    expect(container.textContent).toContain("menos de 24 horas");
  });

  test("shows validation error when field has invalid content on blur", () => {
    const { container } = render(<Valorador />);
    const inputs = container.querySelectorAll("input");
    const nombreInput = inputs[0];

    // Type a single character (too short)
    fireEvent.change(nombreInput, { target: { value: "a" } });
    fireEvent.blur(nombreInput);

    expect(container.textContent).toContain("al menos 2 caracteres");
  });

  test("clears error when user types valid content", () => {
    const { container } = render(<Valorador />);
    const inputs = container.querySelectorAll("input");
    const nombreInput = inputs[0];

    // Trigger error
    fireEvent.change(nombreInput, { target: { value: "a" } });
    fireEvent.blur(nombreInput);
    expect(container.textContent).toContain("al menos 2 caracteres");

    // Fix the value
    fireEvent.change(nombreInput, { target: { value: "ab" } });
    expect(container.textContent).not.toContain("al menos 2 caracteres");
  });

  test("empty field does NOT show error on blur, only on submit", () => {
    const { container } = render(<Valorador />);
    const inputs = container.querySelectorAll("input");
    const nombreInput = inputs[0];
    const form = container.querySelector("form")!;

    // Blur empty field — should NOT show error
    fireEvent.blur(nombreInput);
    expect(container.textContent).not.toContain("obligatorio");

    // Submit with empty fields — should show error
    fireEvent.submit(form);
    expect(container.textContent).toContain("obligatorio");
  });

  test("does not submit when fields have errors", () => {
    const { container } = render(<Valorador />);
    const inputs = container.querySelectorAll("input");
    const form = container.querySelector("form")!;

    // Fill with invalid data
    fireEvent.change(inputs[0], { target: { value: "a" } }); // too short
    fireEvent.change(inputs[1], { target: { value: "612345678" } });
    fireEvent.change(inputs[2], { target: { value: "Calle Mayor 10" } });

    fireEvent.submit(form);

    // Should NOT show success — form has errors
    expect(container.textContent).not.toContain("Gracias");
    expect(container.textContent).toContain("Comencemos tu historia.");
  });

  test("error messages have role='alert' for accessibility", () => {
    const { container } = render(<Valorador />);
    const inputs = container.querySelectorAll("input");
    const nombreInput = inputs[0];

    fireEvent.change(nombreInput, { target: { value: "a" } });
    fireEvent.blur(nombreInput);

    const errorMsg = container.querySelector("[role='alert']");
    expect(errorMsg).not.toBeNull();
    expect(errorMsg?.textContent).toContain("al menos 2 caracteres");
  });

  test("invalid inputs have aria-invalid and aria-describedby", () => {
    const { container } = render(<Valorador />);
    const inputs = container.querySelectorAll("input");
    const nombreInput = inputs[0];

    fireEvent.change(nombreInput, { target: { value: "a" } });
    fireEvent.blur(nombreInput);

    expect(nombreInput.getAttribute("aria-invalid")).toBe("true");
    expect(nombreInput.getAttribute("aria-describedby")).toBe("v3-nombre-error");
  });
});
