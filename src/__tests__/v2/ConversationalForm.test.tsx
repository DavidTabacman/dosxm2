import { expect, test, describe } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import ConversationalForm from "@/components/v2/ConversationalForm";

function clickButton(container: HTMLElement, text: string) {
  const buttons = container.querySelectorAll("button");
  const btn = Array.from(buttons).find((b) => b.textContent === text);
  if (!btn) throw new Error(`Button "${text}" not found`);
  fireEvent.click(btn);
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

  test("'Siguiente' button advances to next step", () => {
    const { container } = render(<ConversationalForm />);
    clickButton(container, "Siguiente");
    expect(container.textContent).toContain("¿Qué tipo de propiedad es?");
  });

  test("second step renders select with property types", () => {
    const { container } = render(<ConversationalForm />);
    clickButton(container, "Siguiente");

    const select = container.querySelector("select");
    expect(select).not.toBeNull();
    expect(container.textContent).toContain("Piso");
    expect(container.textContent).toContain("Ático");
  });

  test("'Atrás' button goes back to previous step", () => {
    const { container } = render(<ConversationalForm />);
    clickButton(container, "Siguiente");
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
    clickButton(container, "Siguiente");
    clickButton(container, "Siguiente");
    clickButton(container, "Siguiente");

    const buttons = container.querySelectorAll("button");
    const enviar = Array.from(buttons).find((b) => b.textContent === "Enviar");
    expect(enviar).not.toBeUndefined();
  });

  test("submission shows success state", () => {
    const { container } = render(<ConversationalForm />);
    clickButton(container, "Siguiente");
    clickButton(container, "Siguiente");
    clickButton(container, "Siguiente");
    clickButton(container, "Enviar");

    expect(container.textContent).toContain("¡Gracias! Te contactaremos pronto.");
    expect(container.textContent).toContain("menos de 24 horas");
  });

  test("success state shows checkmark", () => {
    const { container } = render(<ConversationalForm />);
    clickButton(container, "Siguiente");
    clickButton(container, "Siguiente");
    clickButton(container, "Siguiente");
    clickButton(container, "Enviar");

    const check = container.querySelector("[aria-hidden='true']");
    expect(check?.textContent).toContain("✓");
  });
});
