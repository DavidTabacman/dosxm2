import { describe, expect, test } from "vitest";
import {
  BORJA_PHONE,
  CONTACTO_FOUNDERS,
  FOUNDER_BIOS,
  FOUNDER_BORJA,
  FOUNDER_PABLO,
  FOUNDERS,
  JUNTOS_HEADING,
  JUNTOS_PARAGRAPHS,
  PABLO_PHONE,
  TOGETHER_IMAGE,
  WA_MESSAGE,
} from "@/constants/founders";

describe("constants/founders — identity & contact", () => {
  test("FOUNDER_PABLO has name, portraitUrl, alt", () => {
    expect(FOUNDER_PABLO.name).toBe("Pablo");
    expect(FOUNDER_PABLO.portraitUrl).toBe("/v4/founders/founder_pablo.webp");
    expect(FOUNDER_PABLO.alt).toContain("Pablo");
    expect(FOUNDER_PABLO.alt).toContain("DOSXM2");
  });

  test("FOUNDER_BORJA has name, portraitUrl, alt", () => {
    expect(FOUNDER_BORJA.name).toBe("Borja");
    expect(FOUNDER_BORJA.portraitUrl).toBe("/v4/founders/founder_borja.webp");
    expect(FOUNDER_BORJA.alt).toContain("Borja");
    expect(FOUNDER_BORJA.alt).toContain("DOSXM2");
  });

  test("TOGETHER_IMAGE wires up webp + jpg fallback + alt", () => {
    expect(TOGETHER_IMAGE.webp).toBe("/v4/founders/together.webp");
    expect(TOGETHER_IMAGE.jpgFallback).toBe(
      "/v4/founders/together-1200.jpg"
    );
    expect(TOGETHER_IMAGE.alt).toContain("Pablo");
    expect(TOGETHER_IMAGE.alt).toContain("Borja");
  });

  test("phones are 11-digit Spanish numbers prefixed with 34", () => {
    expect(BORJA_PHONE).toMatch(/^34\d{9}$/);
    expect(PABLO_PHONE).toMatch(/^34\d{9}$/);
  });

  test("FOUNDERS array exposes both founders with their phones", () => {
    expect(FOUNDERS).toHaveLength(2);
    const phones = FOUNDERS.map((f) => f.phone);
    expect(phones).toContain(BORJA_PHONE);
    expect(phones).toContain(PABLO_PHONE);
  });

  test("WA_MESSAGE is a non-empty Spanish prompt", () => {
    expect(WA_MESSAGE.length).toBeGreaterThan(20);
    expect(WA_MESSAGE).toContain("DOSXM2");
  });

  test("CONTACTO_FOUNDERS wires Borja=a, Pablo=b consistently with /v4", () => {
    expect(CONTACTO_FOUNDERS.a.name).toBe("Borja");
    expect(CONTACTO_FOUNDERS.a.phone).toBe(BORJA_PHONE);
    expect(CONTACTO_FOUNDERS.b.name).toBe("Pablo");
    expect(CONTACTO_FOUNDERS.b.phone).toBe(PABLO_PHONE);
    expect(CONTACTO_FOUNDERS.message).toBe(WA_MESSAGE);
  });
});

describe("constants/founders — Conócenos bio copy", () => {
  test("FOUNDER_BIOS exposes both bios with introLine + paragraphs", () => {
    expect(FOUNDER_BIOS.pablo).toBeDefined();
    expect(FOUNDER_BIOS.borja).toBeDefined();
    expect(FOUNDER_BIOS.pablo.paragraphs.length).toBeGreaterThanOrEqual(4);
    expect(FOUNDER_BIOS.borja.paragraphs.length).toBeGreaterThanOrEqual(4);
  });

  test("intro lines contain the raised-hand emoji (unicode integrity guard)", () => {
    // If the build pipeline mangles the multi-codepoint emoji this regresses
    // immediately — the founder's voice depends on it.
    expect(FOUNDER_BIOS.pablo.introLine).toContain("🙋🏻‍♂️");
    expect(FOUNDER_BIOS.borja.introLine).toContain("🙋🏻‍♂️");
    expect(FOUNDER_BIOS.pablo.introLine).toContain("Pablo");
    expect(FOUNDER_BIOS.borja.introLine).toContain("Borja");
  });

  test("Pablo bio carries the BRD §6 hooks (Banfield, UBA)", () => {
    const joined = FOUNDER_BIOS.pablo.paragraphs.join(" ");
    expect(joined).toContain("Banfield");
    expect(joined).toContain("UBA");
    expect(joined).toContain("Madrid");
  });

  test("Borja bio carries the BRD §6 hooks (Getafe, Saint-Gobain)", () => {
    const joined = FOUNDER_BIOS.borja.paragraphs.join(" ");
    expect(joined).toContain("Getafe");
    expect(joined).toContain("Saint-Gobain");
  });

  test("JUNTOS_HEADING and JUNTOS_PARAGRAPHS land the finale", () => {
    expect(JUNTOS_HEADING).toContain("¿Por qué nos unimos?");
    expect(JUNTOS_PARAGRAPHS).toHaveLength(4);
    expect(JUNTOS_PARAGRAPHS[0]).toContain("DOSxM2");
    expect(JUNTOS_PARAGRAPHS[3]).toContain("equipo");
  });
});
