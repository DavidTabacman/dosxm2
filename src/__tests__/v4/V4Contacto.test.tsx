import { expect, test, describe, vi } from "vitest";
import { render, fireEvent, act } from "@testing-library/react";
import V4Contacto from "@/components/v4/V4Contacto";

vi.mock("@/components/shared/useSectionReveal", () => ({
  useSectionReveal: () => [() => {}, true],
}));

function getInput(container: HTMLElement, id: string) {
  return container.querySelector(`[id="${id}"]`) as
    | HTMLInputElement
    | HTMLTextAreaElement
    | null;
}

function fill(
  el: HTMLInputElement | HTMLTextAreaElement | null,
  value: string,
) {
  if (!el) throw new Error("Input not found");
  fireEvent.change(el, { target: { value } });
}

function fillAllValid(container: HTMLElement, contact = "cliente@example.com") {
  fill(getInput(container, "v4-contacto-name"), "Cliente");
  fill(getInput(container, "v4-contacto-contact"), contact);
  fill(getInput(container, "v4-contacto-message"), "Quiero vender mi piso.");
}

function clickSend(container: HTMLElement) {
  const button = container.querySelector(
    "button[type='submit']",
  ) as HTMLButtonElement | null;
  if (!button) throw new Error("Submit button not found");
  fireEvent.click(button);
}

describe("V4 Contacto", () => {
  test("uses #contacto as default section id", () => {
    const { container } = render(<V4Contacto />);
    expect(container.querySelector("section#contacto")).not.toBeNull();
  });

  test("renders the new heading and subtitle copy", () => {
    const { container } = render(<V4Contacto />);
    expect(container.textContent).toContain("Hablemos.");
    expect(container.textContent).toContain("Estamos aquí para ti.");
    expect(container.textContent).toContain("menos de 24 horas");
  });

  test("renders three labelled fields: name, contact, message", () => {
    const { container } = render(<V4Contacto />);
    expect(getInput(container, "v4-contacto-name")).not.toBeNull();
    expect(getInput(container, "v4-contacto-contact")).not.toBeNull();
    expect(getInput(container, "v4-contacto-message")).not.toBeNull();
  });

  test("submit with empty fields shows validation errors", () => {
    const { container } = render(<V4Contacto />);
    clickSend(container);
    const alerts = container.querySelectorAll("[role='alert']");
    expect(alerts.length).toBeGreaterThanOrEqual(1);
  });

  test("name field aria-invalid set on empty submit", () => {
    const { container } = render(<V4Contacto />);
    clickSend(container);
    const name = getInput(container, "v4-contacto-name");
    expect(name?.getAttribute("aria-invalid")).toBe("true");
  });

  test("error clears as user starts typing in the offending field", () => {
    const { container } = render(<V4Contacto />);
    clickSend(container);
    expect(
      container.querySelector('[id="v4-contacto-name-error"]'),
    ).not.toBeNull();
    fill(getInput(container, "v4-contacto-name"), "C");
    expect(container.querySelector('[id="v4-contacto-name-error"]')).toBeNull();
  });

  test("rejects a contact value that is neither email nor phone", () => {
    const { container } = render(<V4Contacto />);
    fill(getInput(container, "v4-contacto-name"), "Cliente");
    fill(getInput(container, "v4-contacto-contact"), "abc");
    fill(getInput(container, "v4-contacto-message"), "Hola");
    clickSend(container);
    const alert = container.querySelector('[id="v4-contacto-contact-error"]');
    expect(alert?.textContent).toContain("email o teléfono");
  });

  test("rejects phone-shaped garbage with no digits", () => {
    const { container } = render(<V4Contacto />);
    fill(getInput(container, "v4-contacto-name"), "Cliente");
    fill(getInput(container, "v4-contacto-contact"), "( ) ( )");
    fill(getInput(container, "v4-contacto-message"), "Hola");
    clickSend(container);
    const alert = container.querySelector('[id="v4-contacto-contact-error"]');
    expect(alert?.textContent).toContain("email o teléfono");
  });

  test("valid email contact submits and shows success state", async () => {
    const { container } = render(<V4Contacto />);
    fillAllValid(container);
    await act(async () => {
      clickSend(container);
    });
    expect(container.textContent).toContain("¡Gracias!");
  });

  test("valid phone contact submits and shows success state", async () => {
    const { container } = render(<V4Contacto />);
    fillAllValid(container, "+34 600 111 222");
    await act(async () => {
      clickSend(container);
    });
    expect(container.textContent).toContain("¡Gracias!");
  });

  test("onSubmit handler receives {name, contact, message}", async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    const { container } = render(<V4Contacto onSubmit={onSubmit} />);
    fillAllValid(container, "+34 600 111 222");
    await act(async () => {
      clickSend(container);
    });
    expect(onSubmit).toHaveBeenCalledTimes(1);
    const payload = onSubmit.mock.calls[0][0];
    expect(payload.name).toBe("Cliente");
    expect(payload.contact).toBe("+34 600 111 222");
    expect(payload.message).toBe("Quiero vender mi piso.");
  });

  test("submit failure surfaces an error and stays on the form", async () => {
    const onSubmit = vi.fn().mockRejectedValue(new Error("red de pruebas"));
    const { container } = render(<V4Contacto onSubmit={onSubmit} />);
    fillAllValid(container);
    await act(async () => {
      clickSend(container);
    });
    expect(container.textContent).not.toContain("¡Gracias!");
    const alerts = container.querySelectorAll("[role='alert']");
    const found = Array.from(alerts).some((a) =>
      a.textContent?.includes("red de pruebas"),
    );
    expect(found).toBe(true);
  });

  test("success state shows founder WhatsApp links when founders are provided", async () => {
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
    const { container } = render(<V4Contacto founders={founders} />);
    fillAllValid(container);
    await act(async () => {
      clickSend(container);
    });
    const links = container.querySelectorAll("a[href*='wa.me/']");
    expect(links).toHaveLength(2);
    expect(links[0].getAttribute("href")).toContain("wa.me/34667006662");
    expect(links[1].getAttribute("href")).toContain("wa.me/34674527410");
  });

  test("success state renders no WhatsApp links when founders are absent", async () => {
    const { container } = render(<V4Contacto />);
    fillAllValid(container);
    await act(async () => {
      clickSend(container);
    });
    expect(container.textContent).toContain("¡Gracias!");
    expect(container.querySelector("a[href*='wa.me']")).toBeNull();
  });

  test("contact input uses inputMode=email for combined phone/email UX", () => {
    const { container } = render(<V4Contacto />);
    const input = getInput(container, "v4-contacto-contact");
    expect(input?.getAttribute("inputmode")).toBe("email");
    expect(input?.getAttribute("autocomplete")).toBe("email tel");
  });

  test("does NOT auto-focus any field on mount", () => {
    const { container } = render(<V4Contacto />);
    const name = getInput(container, "v4-contacto-name");
    expect(document.activeElement).not.toBe(name);
  });
});
