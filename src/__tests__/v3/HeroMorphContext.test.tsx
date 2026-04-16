import { expect, test, describe } from "vitest";
import { render } from "@testing-library/react";
import { HeroMorphProvider, useHeroMorph } from "@/components/v3/HeroMorphContext";

function TestConsumer() {
  const ctx = useHeroMorph();
  return (
    <div>
      <span data-testid="has-register-hero">{typeof ctx.registerHeroRef}</span>
      <span data-testid="has-register-portfolio">{typeof ctx.registerPortfolioRef}</span>
      <span data-testid="has-register-first-card">{typeof ctx.registerFirstCardRef}</span>
      <span data-testid="has-morph-layer-ref">{typeof ctx.morphLayerRef}</span>
    </div>
  );
}

describe("V3 HeroMorphContext", () => {
  test("provider renders children", () => {
    const { container } = render(
      <HeroMorphProvider>
        <div data-testid="child">Hello</div>
      </HeroMorphProvider>
    );
    expect(container.querySelector("[data-testid='child']")?.textContent).toBe("Hello");
  });

  test("context provides register functions", () => {
    const { container } = render(
      <HeroMorphProvider>
        <TestConsumer />
      </HeroMorphProvider>
    );
    expect(container.querySelector("[data-testid='has-register-hero']")?.textContent).toBe("function");
    expect(container.querySelector("[data-testid='has-register-portfolio']")?.textContent).toBe("function");
    expect(container.querySelector("[data-testid='has-register-first-card']")?.textContent).toBe("function");
    expect(container.querySelector("[data-testid='has-morph-layer-ref']")?.textContent).toBe("object");
  });

  test("default context (outside provider) provides noop functions", () => {
    const { container } = render(<TestConsumer />);
    expect(container.querySelector("[data-testid='has-register-hero']")?.textContent).toBe("function");
    expect(container.querySelector("[data-testid='has-register-portfolio']")?.textContent).toBe("function");
    expect(container.querySelector("[data-testid='has-register-first-card']")?.textContent).toBe("function");
  });
});
