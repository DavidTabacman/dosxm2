// sRGB luminance + contrast-ratio helpers for WCAG assertions.
// No runtime dependency; accepts #rrggbb or rgba(r,g,b,a) inputs.

type RGB = { r: number; g: number; b: number };

function parseColor(input: string): RGB & { a: number } {
  const s = input.trim();
  if (s.startsWith("#")) {
    const hex = s.slice(1);
    if (hex.length === 3) {
      return {
        r: parseInt(hex[0] + hex[0], 16),
        g: parseInt(hex[1] + hex[1], 16),
        b: parseInt(hex[2] + hex[2], 16),
        a: 1,
      };
    }
    if (hex.length === 6) {
      return {
        r: parseInt(hex.slice(0, 2), 16),
        g: parseInt(hex.slice(2, 4), 16),
        b: parseInt(hex.slice(4, 6), 16),
        a: 1,
      };
    }
    throw new Error(`parseColor: unsupported hex "${input}"`);
  }
  const m = s.match(/^rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)(?:\s*,\s*([\d.]+))?\s*\)$/i);
  if (!m) throw new Error(`parseColor: cannot parse "${input}"`);
  return {
    r: Number(m[1]),
    g: Number(m[2]),
    b: Number(m[3]),
    a: m[4] !== undefined ? Number(m[4]) : 1,
  };
}

function channelLuminance(c: number): number {
  const v = c / 255;
  return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
}

export function srgbLuminance(input: string): number {
  const { r, g, b } = parseColor(input);
  return (
    0.2126 * channelLuminance(r) +
    0.7152 * channelLuminance(g) +
    0.0722 * channelLuminance(b)
  );
}

export function contrastRatio(fg: string, bg: string): number {
  const a = parseColor(fg);
  const b = parseColor(bg);

  // Alpha-composite foreground on background if fg has alpha.
  const composed =
    a.a < 1
      ? {
          r: a.r * a.a + b.r * (1 - a.a),
          g: a.g * a.a + b.g * (1 - a.a),
          b: a.b * a.a + b.b * (1 - a.a),
        }
      : a;

  const lFg = srgbLuminance(
    `rgba(${composed.r}, ${composed.g}, ${composed.b}, 1)`
  );
  const lBg = srgbLuminance(bg);
  const light = Math.max(lFg, lBg);
  const dark = Math.min(lFg, lBg);
  return (light + 0.05) / (dark + 0.05);
}

export function flattenRgba(rgba: string, onHex: string): string {
  const f = parseColor(rgba);
  const b = parseColor(onHex);
  const r = Math.round(f.r * f.a + b.r * (1 - f.a));
  const g = Math.round(f.g * f.a + b.g * (1 - f.a));
  const bl = Math.round(f.b * f.a + b.b * (1 - f.a));
  const toHex = (n: number) => n.toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(bl)}`;
}
