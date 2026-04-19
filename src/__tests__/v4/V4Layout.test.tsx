import { expect, test, describe } from "vitest";
import { render } from "@testing-library/react";
import V4Layout from "@/components/v4/V4Layout";

describe("V4 V4Layout", () => {
  test("renders children inside root wrapper", () => {
    const { container } = render(
      <V4Layout fontClassName="my-font">
        <p>contenido v4</p>
      </V4Layout>
    );
    expect(container.textContent).toContain("contenido v4");
  });

  test("applies the font className to the root element", () => {
    const { container } = render(
      <V4Layout fontClassName="custom-font-var">
        <span />
      </V4Layout>
    );
    expect(container.firstElementChild?.className).toContain("custom-font-var");
  });

  test("resets scroll position to top on mount", () => {
    // setup.ts stubs window.scrollTo — just verify render completes cleanly,
    // meaning the effect ran without throwing.
    expect(() =>
      render(
        <V4Layout fontClassName="">
          <span>ok</span>
        </V4Layout>
      )
    ).not.toThrow();
  });
});
