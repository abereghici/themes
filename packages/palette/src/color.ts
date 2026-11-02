/** The color math the palette needs, on top of Color.js (https://colorjs.io). */
import Color from "colorjs.io";

const toHex = (color: Color): string =>
  color.to("srgb").toString({ format: "hex", collapse: false });

/** sRGB channels in 0–1. */
export const hexToRgb = (hex: string): readonly [number, number, number] => {
  const [r = 0, g = 0, b = 0] = new Color(hex).to("srgb").coords;

  return [r, g, b];
};

/** WCAG 2 contrast ratio between two opaque colors, 1–21. */
export const contrastRatio = (foreground: string, background: string): number =>
  Color.contrast(foreground, background, "WCAG21");

/** `amount` (0–1) of `to` mixed into `from`, in OKLab, as an opaque hex color. */
export const mixOklab = (from: string, to: string, amount: number): string =>
  toHex(Color.mix(from, to, amount, { space: "oklab", outputSpace: "srgb" }));
