import { styleText } from 'node:util';

export function createNamesTable(names: string[], columns = 4) {
  if (names.length === 0) return '';

  const cols = Math.max(1, columns);
  const maxLen = Math.max(...names.map((s) => s.length));
  const colWidth = maxLen + 2;

  const rows = Math.ceil(names.length / cols);
  const lines: string[] = [];

  for (let r = 0; r < rows; r++) {
    const start = r * cols;
    const rowItems = names.slice(start, start + cols);
    const padded = rowItems.map((s) => s.padEnd(colWidth, ' '));
    lines.push(padded.join('').replace(/\s+$/u, ''));
  }

  return lines.join('\n');
}

export function printGrayNamesTable(names: string[], columns = 4) {
  const table = createNamesTable(names, columns);
  if (!table) return;

  console.log(
    table
      .split('\n')
      .map((line) => styleText('gray', line))
      .join('\n'),
  );
}
