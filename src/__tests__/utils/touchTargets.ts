import { expect } from "vitest";

// WCAG 2.5.5 Level AAA — minimum target size 44×44 CSS pixels.
export const MIN_TAP_PX = 44;

// Pulls the first rule body (selector { ... }) whose selector contains every
// segment in `selectorFragments` (in order is not required). Returns the
// declaration block, or null if no match.
export function extractRuleBody(
  source: string,
  selectorFragments: string[]
): string | null {
  const ruleRegex = /([^{}]+)\{([^{}]*)\}/g;
  let match: RegExpExecArray | null;
  while ((match = ruleRegex.exec(source)) !== null) {
    const selector = match[1].trim();
    if (selectorFragments.every((f) => selector.includes(f))) {
      return match[2];
    }
  }
  return null;
}

export function assertMinTapTarget(
  body: string | null,
  label: string
): void {
  if (body === null) {
    throw new Error(`${label}: rule body not found in source`);
  }
  const hasMinHeight = /min-height\s*:\s*44px/.test(body);
  const hasMinWidth = /min-width\s*:\s*44px/.test(body);
  expect(hasMinHeight, `${label} min-height: 44px`).toBe(true);
  expect(hasMinWidth, `${label} min-width: 44px`).toBe(true);
}

export function assertMinHeight44(
  body: string | null,
  label: string
): void {
  if (body === null) {
    throw new Error(`${label}: rule body not found in source`);
  }
  expect(/min-height\s*:\s*44px/.test(body), `${label} min-height: 44px`).toBe(
    true
  );
}
