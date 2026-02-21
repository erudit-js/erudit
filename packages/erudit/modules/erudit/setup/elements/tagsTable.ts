import type { ElementData } from './shared';

export function createTagsTable(elementsData: ElementData[], columns = 4) {
  const tagNames = elementsData.flatMap((data) =>
    data.coreElements.flatMap((coreElement) => Object.keys(coreElement.tags)),
  );

  if (tagNames.length === 0) return '';

  const cols = Math.max(1, columns);
  const formatted = tagNames.map((t) => `<${t}>`);
  const maxLen = Math.max(...formatted.map((s) => s.length));
  const colWidth = maxLen + 2; // padding between columns

  const rows = Math.ceil(formatted.length / cols);
  const lines: string[] = [];

  for (let r = 0; r < rows; r++) {
    const start = r * cols;
    const rowItems = formatted.slice(start, start + cols);
    const padded = rowItems.map((s) => s.padEnd(colWidth, ' '));
    lines.push(padded.join('').replace(/\s+$/u, '')); // trim trailing spaces on the row
  }

  const tagTable = lines.join('\n');

  return tagTable;
}
