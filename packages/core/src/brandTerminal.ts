import { brandColors, brandLogotype } from './brand.js';

function hexToRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.replace('#', ''), 16);
  return [(n >> 16) & 0xff, (n >> 8) & 0xff, n & 0xff];
}

function lerp(a: number, b: number, t: number): number {
  return Math.round(a + (b - a) * t);
}

function colorChar(
  char: string,
  t: number,
  rgbColors: [number, number, number][],
): string {
  const segments = rgbColors.length - 1;
  const scaled = t * segments;
  const seg = Math.min(Math.floor(scaled), segments - 1);
  const localT = scaled - seg;
  const [r1, g1, b1] = rgbColors[seg]!;
  const [r2, g2, b2] = rgbColors[seg + 1]!;
  return `\x1b[38;2;${lerp(r1, r2, localT)};${lerp(g1, g2, localT)};${lerp(b1, b2, localT)}m${char}`;
}

/** Apply gradient across each line independently (matching gradient-string's .multiline()). */
function gradientMultiline(text: string, colors: string[]): string {
  const rgbColors = colors.map(hexToRgb);
  return text
    .split('\n')
    .map((line) => {
      if (line.length === 0) return line;
      return (
        [...line]
          .map((char, i) =>
            colorChar(char, i / (line.length - 1 || 1), rgbColors),
          )
          .join('') + '\x1b[0m'
      );
    })
    .join('\n');
}

/** Apply gradient across all characters in a single string. */
function gradientText(text: string, colors: string[]): string {
  const rgbColors = colors.map(hexToRgb);
  const chars = [...text];
  const total = chars.length - 1 || 1;
  return (
    chars.map((char, i) => colorChar(char, i / total, rgbColors)).join('') +
    '\x1b[0m'
  );
}

export const brandColorLogotype = gradientMultiline(brandLogotype, brandColors);
export const brandColorTitle = gradientText('Erudit', brandColors);
