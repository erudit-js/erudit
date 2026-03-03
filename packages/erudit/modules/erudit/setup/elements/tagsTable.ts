import type { ElementData } from './shared';
import { createNamesTable } from '../namesTable';

export function createTagsTable(elementsData: ElementData[], columns = 4) {
  const tagNames = elementsData.flatMap((data) =>
    data.coreElements.flatMap((coreElement) => Object.keys(coreElement.tags)),
  );

  const formatted = tagNames.map((t) => `<${t}>`);

  return createNamesTable(formatted, columns);
}
