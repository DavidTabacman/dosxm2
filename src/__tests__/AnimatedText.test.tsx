import { expect, test, describe } from "vitest";
import { render, screen } from "@testing-library/react";
import AnimatedText from "@/components/AnimatedText";

describe("AnimatedText", () => {
  test("renders all characters as individual spans", () => {
    const { container } = render(<AnimatedText text="Hola" />);
    const chars = container.querySelectorAll("[aria-hidden='true']");
    expect(chars).toHaveLength(4);
  });

  test("renders sr-only span with full text", () => {
    render(<AnimatedText text="Hola mundo" />);
    expect(screen.getByText("Hola mundo")).toBeDefined();
  });

  test("applies staggered animation-delay", () => {
    const { container } = render(
      <AnimatedText text="abc" delayMs={100} staggerMs={50} />
    );
    const chars = container.querySelectorAll<HTMLSpanElement>(
      "[aria-hidden='true']"
    );
    expect(chars[0].style.animationDelay).toBe("100ms");
    expect(chars[1].style.animationDelay).toBe("150ms");
    expect(chars[2].style.animationDelay).toBe("200ms");
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
    const chars = container.querySelectorAll("[aria-hidden='true']");
    expect(chars).toHaveLength(0);
  });

  test("renders non-breaking space for whitespace characters", () => {
    const { container } = render(<AnimatedText text="a b" />);
    const chars = container.querySelectorAll<HTMLSpanElement>(
      "[aria-hidden='true']"
    );
    expect(chars[1].textContent).toBe("\u00A0");
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
});
