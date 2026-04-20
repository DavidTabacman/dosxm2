import { expect, test, describe, vi } from "vitest";
import { render, fireEvent, act } from "@testing-library/react";
import V4Valorador from "@/components/v4/V4Valorador";

vi.mock("@/components/shared/useSectionReveal", () => ({
  useSectionReveal: () => [() => {}, true],
}));

function fillActiveInput(container: HTMLElement, value: string) {
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
    return;
  }
  throw new Error("No active form field found");
}

function clickByText(container: HTMLElement, text: string) {
  const buttons = container.querySelectorAll("button");
  const btn = Array.from(buttons).find((b) => b.textContent?.trim() === text);
  if (!btn) throw new Error(`Button "${text}" not found`);
  fireEvent.click(btn);
}

function nextStep(container: HTMLElement, value: string) {
  fillActiveInput(container, value);
  clickByText(container, "Siguiente");
}

describe("V4 Valorador", () => {
  test("uses #valorador as default section id", () => {
    const { container } = render(<V4Valorador />);
    expect(container.querySelector("section#valorador")).not.toBeNull();
  });

  test("renders the first step question", () => {
    const { container } = render(<V4Valorador />);
    expect(container.textContent).toContain(
      "Empecemos por conocer tu casa"
    );
  });

  test("does not advance when input is empty (validation)", () => {
    const { container } = render(<V4Valorador />);
    clickByText(container, "Siguiente");
    expect(container.textContent).toContain("Empecemos por conocer tu casa");
  });

  test("shows error with role=alert on empty submit", () => {
    const { container } = render(<V4Valorador />);
    clickByText(container, "Siguiente");
    const alert = container.querySelector("[role='alert']");
    expect(alert).not.toBeNull();
    expect(alert?.textContent).toContain("obligatorio");
  });

  test("sets aria-invalid on input after empty validation", () => {
    const { container } = render(<V4Valorador />);
    clickByText(container, "Siguiente");
    const input = container.querySelector("input");
    expect(input?.getAttribute("aria-invalid")).toBe("true");
  });

  test("error clears as user starts typing", () => {
    const { container } = render(<V4Valorador />);
    clickByText(container, "Siguiente");
    expect(container.querySelector("[role='alert']")).not.toBeNull();
    fillActiveInput(container, "C");
    expect(container.querySelector("[role='alert']")).toBeNull();
  });

  test("advances to step 2 when step 1 is filled", () => {
    const { container } = render(<V4Valorador />);
    nextStep(container, "Chamberí");
    expect(container.textContent).toContain("¿Qué tipo de propiedad es?");
  });

  test("atrás returns to previous step", () => {
    const { container } = render(<V4Valorador />);
    nextStep(container, "Chamberí");
    clickByText(container, "Atrás");
    expect(container.textContent).toContain("Empecemos por conocer tu casa");
  });

  test("atrás is hidden on step 1", () => {
    const { container } = render(<V4Valorador />);
    const buttons = container.querySelectorAll("button");
    const back = Array.from(buttons).find((b) => b.textContent?.trim() === "Atrás");
    expect(back).toBeUndefined();
  });

  test("meters step rejects implausible sizes", () => {
    const { container } = render(<V4Valorador />);
    nextStep(container, "Chamberí"); // step 1
    nextStep(container, "Piso");      // step 2
    fillActiveInput(container, "3");  // too small
    clickByText(container, "Siguiente");
    const alert = container.querySelector("[role='alert']");
    expect(alert).not.toBeNull();
    expect(alert?.textContent).toContain("superficie válida");
  });

  test("contact step rejects text that is neither email nor phone", () => {
    const { container } = render(<V4Valorador />);
    nextStep(container, "Chamberí");
    nextStep(container, "Piso");
    nextStep(container, "85");
    fillActiveInput(container, "abc");
    clickByText(container, "Enviar");
    const alert = container.querySelector("[role='alert']");
    expect(alert).not.toBeNull();
    expect(alert?.textContent).toContain("email o teléfono");
  });

  test("contact step rejects phone-shaped garbage with no digits", () => {
    const { container } = render(<V4Valorador />);
    nextStep(container, "Chamberí");
    nextStep(container, "Piso");
    nextStep(container, "85");
    // "( ) ( ) ( )" matches the phone char-set but has zero digits.
    fillActiveInput(container, "( ) ( ) ( )");
    clickByText(container, "Enviar");
    const alert = container.querySelector("[role='alert']");
    expect(alert).not.toBeNull();
    expect(alert?.textContent).toContain("email o teléfono");
  });

  test("renders the final 'Enviar' button on last step", () => {
    const { container } = render(<V4Valorador />);
    nextStep(container, "Chamberí");
    nextStep(container, "Piso");
    nextStep(container, "85");
    const buttons = container.querySelectorAll("button");
    const send = Array.from(buttons).find((b) => b.textContent?.trim() === "Enviar");
    expect(send).not.toBeUndefined();
  });

  test("valid email as contact submits and shows success state", async () => {
    const { container } = render(<V4Valorador />);
    nextStep(container, "Chamberí");
    nextStep(container, "Piso");
    nextStep(container, "85");
    fillActiveInput(container, "cliente@example.com");
    await act(async () => {
      clickByText(container, "Enviar");
    });
    expect(container.textContent).toContain("¡Gracias!");
    expect(container.textContent).toContain("menos de 24 horas");
  });

  test("onSubmit handler receives step answers keyed by id", async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    const { container } = render(<V4Valorador onSubmit={onSubmit} />);
    nextStep(container, "Chamberí");
    nextStep(container, "Piso");
    nextStep(container, "85");
    fillActiveInput(container, "+34 600 111 222");
    await act(async () => {
      clickByText(container, "Enviar");
    });
    expect(onSubmit).toHaveBeenCalledTimes(1);
    const payload = onSubmit.mock.calls[0][0];
    expect(payload.zona).toBe("Chamberí");
    expect(payload.tipo).toBe("Piso");
    expect(payload.metros).toBe("85");
    expect(payload.contacto).toBe("+34 600 111 222");
  });

  test("submit failure surfaces an error and stays on the step", async () => {
    const onSubmit = vi.fn().mockRejectedValue(new Error("red de pruebas"));
    const { container } = render(<V4Valorador onSubmit={onSubmit} />);
    nextStep(container, "Chamberí");
    nextStep(container, "Piso");
    nextStep(container, "85");
    fillActiveInput(container, "cliente@example.com");
    await act(async () => {
      clickByText(container, "Enviar");
    });
    // Should NOT be in success state
    expect(container.textContent).not.toContain("¡Gracias!");
    // Should show the error message
    const alert = container.querySelector("[role='alert']");
    expect(alert?.textContent).toContain("red de pruebas");
  });

  test("success state exposes both founder WhatsApp links when founders are provided", async () => {
    const founders = {
      a: {
        name: "Borja",
        phone: "34667006662",
        portraitUrl: "/founders/a.webp",
        portraitAlt: "Retrato de Borja",
      },
      b: {
        name: "Pablo",
        phone: "34674527410",
        portraitUrl: "/founders/b.webp",
        portraitAlt: "Retrato de Pablo",
      },
      message: "Hola DOSXM2",
    };
    const { container } = render(<V4Valorador founders={founders} />);
    nextStep(container, "Chamberí");
    nextStep(container, "Piso");
    nextStep(container, "85");
    fillActiveInput(container, "cliente@example.com");
    await act(async () => {
      clickByText(container, "Enviar");
    });
    const links = container.querySelectorAll("a[href*='wa.me/']");
    expect(links).toHaveLength(2);
    expect(links[0].getAttribute("href")).toContain("wa.me/34667006662");
    expect(links[1].getAttribute("href")).toContain("wa.me/34674527410");
    // Invitation copy names both founders so the two portraits read as
    // a single invitation rather than a pair of unexplained avatars.
    expect(container.textContent).toContain("Borja");
    expect(container.textContent).toContain("Pablo");
  });

  test("success state renders no WhatsApp links when founders are absent", async () => {
    const { container } = render(<V4Valorador />);
    nextStep(container, "Chamberí");
    nextStep(container, "Piso");
    nextStep(container, "85");
    fillActiveInput(container, "cliente@example.com");
    await act(async () => {
      clickByText(container, "Enviar");
    });
    expect(container.textContent).toContain("¡Gracias!");
    expect(container.querySelector("a[href*='wa.me']")).toBeNull();
  });

  test("progress bar has ARIA attributes for step progress", () => {
    const { container } = render(<V4Valorador />);
    const progress = container.querySelector("[role='progressbar']");
    expect(progress).not.toBeNull();
    expect(progress?.getAttribute("aria-valuemin")).toBe("0");
    expect(progress?.getAttribute("aria-valuenow")).toBe("1");
  });

  test("select step wraps the <select> in a .selectWrap for mask-chevron", () => {
    const { container } = render(<V4Valorador />);
    nextStep(container, "Chamberí"); // advance to select step
    const wrap = container.querySelector("[class*='selectWrap']");
    expect(wrap).not.toBeNull();
    const selectInside = wrap!.querySelector("select");
    expect(selectInside).not.toBeNull();
  });

  test("does NOT auto-focus the input on mount (avoids yanking viewport)", () => {
    const { container } = render(<V4Valorador />);
    const input = container.querySelector("input");
    expect(input).not.toBeNull();
    expect(document.activeElement).not.toBe(input);
  });

  test("focuses the input on step transition (after a Siguiente click)", () => {
    const { container } = render(<V4Valorador />);
    nextStep(container, "Chamberí");
    // Advance to meters step: select with "Piso" then click Siguiente.
    fillActiveInput(container, "Piso");
    clickByText(container, "Siguiente");
    const nextInput = container.querySelector("input");
    expect(nextInput).not.toBeNull();
    expect(document.activeElement).toBe(nextInput);
  });

  test("first-step label uses nbsp before ¿ to avoid a line-orphan question mark", () => {
    const { container } = render(<V4Valorador />);
    const label = container.querySelector("label");
    // A non-breaking space (\u00A0) — not the ordinary ASCII space — should
    // glue "casa." to "¿Dónde".
    expect(label?.textContent).toMatch(/casa\.\u00A0¿Dónde/);
  });

  test("contact step input uses inputMode=email for combined phone/email UX", () => {
    const { container } = render(<V4Valorador />);
    nextStep(container, "Chamberí");
    nextStep(container, "Piso");
    nextStep(container, "85");
    const input = container.querySelector("input");
    expect(input?.getAttribute("inputmode")).toBe("email");
    expect(input?.getAttribute("autocomplete")).toBe("email tel");
    expect(input?.getAttribute("type")).toBe("text");
  });
});
