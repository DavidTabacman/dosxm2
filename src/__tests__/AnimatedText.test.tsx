import { expect, test, describe } from "vitest";
import { render, screen } from "@testing-library/react";
import AnimatedText from "@/components/AnimatedText";

describe("AnimatedText", () => {
  test("renders all characters as individual spans within word groups", () => {
    const { container } = render(<AnimatedText text="Hola" />);
    // "Hola" is one word — 4 char spans inside 1 word span
    const words = container.querySelectorAll("[aria-hidden='true']");
    // 1 word span wrapping 4 char spans
    expect(words).toHaveLength(1);
    const chars = words[0].querySelectorAll("span");
    expect(chars).toHaveLength(4);
  });

  test("renders sr-only span with full text", () => {
    render(<AnimatedText text="Hola mundo" />);
    expect(screen.getByText("Hola mundo")).toBeDefined();
  });

  test("applies staggered animation-delay across words", () => {
    const { container } = render(
      <AnimatedText text="ab c" delayMs={100} staggerMs={50} />
    );
    // "ab" = word 0 (chars at index 0,1), " " = space (index 2), "c" = word 1 (index 3)
    const wordSpans = container.querySelectorAll(
      "[aria-hidden='true'] > span"
    );
    // First word chars
    expect(
      (wordSpans[0] as HTMLSpanElement).style.animationDelay
    ).toBe("100ms");
    expect(
      (wordSpans[1] as HTMLSpanElement).style.animationDelay
    ).toBe("150ms");
  });

  test("renders correct HTML tag when tag='h1'", () => {
    const { container } = render(<AnimatedText text="Titulo" tag="h1" />);
    const h1 = container.querySelector("h1");
    expect(h1).not.toBeNull();
  });

  test("defaults to span tag", () => {
    const { container } = render(<AnimatedText text="test" />);
    const wrapper = container.firstElementChild;
    expect(wrapper?.tagName).toBe("SPAN");
  });

  test("handles empty string", () => {
    const { container } = render(<AnimatedText text="" />);
    const ariaHidden = container.querySelectorAll("[aria-hidden='true']");
    // Empty string splits into [""] — one word span with no visible chars
    expect(ariaHidden).toHaveLength(1);
  });

  test("renders space as non-breaking space between words", () => {
    const { container } = render(<AnimatedText text="a b" />);
    // "a" word + space span + "b" word = 3 aria-hidden spans
    const ariaHidden = container.querySelectorAll("[aria-hidden='true']");
    expect(ariaHidden).toHaveLength(3);
    // The space span is the second aria-hidden element
    expect(ariaHidden[1].textContent).toBe("\u00A0");
  });

  test("forwards className prop to wrapper", () => {
    const { container } = render(
      <AnimatedText text="test" className="my-class" />
    );
    expect(container.firstElementChild?.classList.contains("my-class")).toBe(
      true
    );
  });

  test("forwards id prop to wrapper", () => {
    const { container } = render(<AnimatedText text="test" id="my-id" />);
    expect(container.firstElementChild?.id).toBe("my-id");
  });

  test("keeps words together without breaking mid-word", () => {
    const { container } = render(<AnimatedText text="Hola mundo" />);
    // Should have 2 word spans + 1 space span = 3 aria-hidden elements
    const ariaHidden = container.querySelectorAll("[aria-hidden='true']");
    expect(ariaHidden).toHaveLength(3);
    // First word span contains "Hola" chars
    expect(ariaHidden[0].textContent).toBe("Hola");
    // Third word span contains "mundo" chars
    expect(ariaHidden[2].textContent).toBe("mundo");
  });
});
