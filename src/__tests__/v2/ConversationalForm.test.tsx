import { expect, test, describe, vi, beforeEach, afterEach } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import ConversationalForm from "@/components/v2/ConversationalForm";

function fillInput(container: HTMLElement, value: string) {
  const input = container.querySelector("input");
  if (input) {
    fireEvent.change(input, { target: { value } });
    return;
  }
  const select = container.querySelector("select");
  if (select) {
    fireEvent.change(select, { target: { value } });
    return;
  }
  const textarea = container.querySelector("textarea");
  if (textarea) {
    fireEvent.change(textarea, { target: { value } });
  }
}

function clickButton(container: HTMLElement, text: string) {
  const buttons = container.querySelectorAll("button");
  const btn = Array.from(buttons).find((b) => b.textContent === text);
  if (!btn) throw new Error(`Button "${text}" not found`);
  fireEvent.click(btn);
}

function advanceStep(container: HTMLElement, value: string) {
  fillInput(container, value);
  clickButton(container, "Siguiente");
}

describe("V2 ConversationalForm", () => {
  test("renders heading 'Cuéntanos sobre tu casa.'", () => {
    const { container } = render(<ConversationalForm />);
    const h2 = container.querySelector("h2");
    expect(h2?.textContent).toBe("Cuéntanos sobre tu casa.");
  });

  test("renders subheading", () => {
    const { container } = render(<ConversationalForm />);
    expect(container.textContent).toContain(
      "Nosotros nos encargamos del resto."
    );
  });

  test("first step shows zona question", () => {
    const { container } = render(<ConversationalForm />);
    expect(container.textContent).toContain(
      "¿En qué zona está tu propiedad?"
    );
  });

  test("first step has placeholder text", () => {
    const { container } = render(<ConversationalForm />);
    const input = container.querySelector("input");
    expect(input?.getAttribute("placeholder")).toContain("Chamberí");
  });

  test("renders 4 progress dots", () => {
    const { container } = render(<ConversationalForm />);
    const dots = container.querySelectorAll("span[class*='dot']");
    expect(dots).toHaveLength(4);
  });

  test("'Siguiente' button advances to next step when input is filled", () => {
    const { container } = render(<ConversationalForm />);
    advanceStep(container, "Chamberí");
    expect(container.textContent).toContain("¿Qué tipo de propiedad es?");
  });

  test("second step renders select with property types", () => {
    const { container } = render(<ConversationalForm />);
    advanceStep(container, "Chamberí");

    const select = container.querySelector("select");
    expect(select).not.toBeNull();
    expect(container.textContent).toContain("Piso");
    expect(container.textContent).toContain("Ático");
  });

  test("'Atrás' button goes back to previous step", () => {
    const { container } = render(<ConversationalForm />);
    advanceStep(container, "Chamberí");
    expect(container.textContent).toContain("¿Qué tipo de propiedad es?");

    clickButton(container, "Atrás");
    expect(container.textContent).toContain(
      "¿En qué zona está tu propiedad?"
    );
  });

  test("'Atrás' button is not shown on first step", () => {
    const { container } = render(<ConversationalForm />);
    const buttons = container.querySelectorAll("button");
    const backBtn = Array.from(buttons).find((b) => b.textContent === "Atrás");
    expect(backBtn).toBeUndefined();
  });

  test("last step shows 'Enviar' instead of 'Siguiente'", () => {
    const { container } = render(<ConversationalForm />);
    advanceStep(container, "Chamberí");
    advanceStep(container, "Piso");
    advanceStep(container, "85 m²");

    const buttons = container.querySelectorAll("button");
    const enviar = Array.from(buttons).find((b) => b.textContent === "Enviar");
    expect(enviar).not.toBeUndefined();
  });

  test("submission shows success state", () => {
    const { container } = render(<ConversationalForm />);
    advanceStep(container, "Chamberí");
    advanceStep(container, "Piso");
    advanceStep(container, "85 m²");
    fillInput(container, "Reformas recientes");
    clickButton(container, "Enviar");

    expect(container.textContent).toContain("¡Gracias! Te contactaremos pronto.");
    expect(container.textContent).toContain("menos de 24 horas");
  });

  test("success state shows animated SVG checkmark", () => {
    const { container } = render(<ConversationalForm />);
    advanceStep(container, "Chamberí");
    advanceStep(container, "Piso");
    advanceStep(container, "85 m²");
    fillInput(container, "Reformas recientes");
    clickButton(container, "Enviar");

    const ariaHidden = container.querySelector("[aria-hidden='true']");
    expect(ariaHidden).not.toBeNull();
    const svg = ariaHidden?.querySelector("svg");
    expect(svg).not.toBeNull();
    const circle = svg?.querySelector("circle");
    expect(circle).not.toBeNull();
    const path = svg?.querySelector("path");
    expect(path).not.toBeNull();
  });

  test("success state has role=status for screen readers", () => {
    const { container } = render(<ConversationalForm />);
    advanceStep(container, "Chamberí");
    advanceStep(container, "Piso");
    advanceStep(container, "85 m²");
    fillInput(container, "Reformas recientes");
    clickButton(container, "Enviar");

    const status = container.querySelector("[role='status']");
    expect(status).not.toBeNull();
  });
});

describe("V2 ConversationalForm validation", () => {
  test("does not advance step when input is empty", () => {
    const { container } = render(<ConversationalForm />);
    clickButton(container, "Siguiente");
    expect(container.textContent).toContain(
      "¿En qué zona está tu propiedad?"
    );
  });

  test("shows error message when submitting empty field", () => {
    const { container } = render(<ConversationalForm />);
    clickButton(container, "Siguiente");

    const errorEl = container.querySelector("[role='alert']");
    expect(errorEl).not.toBeNull();
    expect(errorEl?.textContent).toContain("obligatorio");
  });

  test("sets aria-invalid on input after validation failure", () => {
    const { container } = render(<ConversationalForm />);
    clickButton(container, "Siguiente");

    const input = container.querySelector("input");
    expect(input?.getAttribute("aria-invalid")).toBe("true");
  });

  test("shake class applied to input on empty submission", () => {
    const { container } = render(<ConversationalForm />);
    clickButton(container, "Siguiente");

    const input = container.querySelector("input");
    expect(input?.className).toContain("shake");
  });

  test("error clears when user starts typing", () => {
    const { container } = render(<ConversationalForm />);
    clickButton(container, "Siguiente");

    // Error should be visible
    expect(container.querySelector("[role='alert']")).not.toBeNull();

    // Start typing
    fillInput(container, "C");

    // Error should be gone
    expect(container.querySelector("[role='alert']")).toBeNull();
  });
});
