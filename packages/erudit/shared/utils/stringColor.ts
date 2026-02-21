export function stringColor(text: string) {
  // FNV-1a — >>> 0 after every step keeps values in unsigned 32-bit space
  let hash = 0x811c9dc5 >>> 0;
  for (let i = 0; i < text.length; i++) {
    hash = (hash ^ text.charCodeAt(i)) >>> 0;
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }

  // Wang hash finalizer — avalanche remaining bit clusters
  hash = (hash ^ (hash >>> 16)) >>> 0;
  hash = Math.imul(hash, 0x45d9f3b) >>> 0;
  hash = (hash ^ (hash >>> 16)) >>> 0;

  // Divide full uint32 range by 2^32 → uniform [0, 1) → full 360° hue wheel
  const h = Math.floor((hash / 0x100000000) * 360);
  // Use a non-overlapping slice of bits for saturation variance
  const s = 55 + Math.floor(((hash >>> 22) / 0x400) * 20); // 55–74%

  const lightColor = `hsl(${h}, 70%, 35%)`;
  const darkColor = `hsl(${h}, 70%, 68%)`;

  return `light-dark(${lightColor}, ${darkColor})`;
}
