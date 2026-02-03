import { ProseError, type AnySchema, type ProseElement } from '@jsprose/core';

import type { AppElement } from '../appElement.js';
import { useProseContext } from './context.js';

export function useAppElement(schemaName: string): AppElement;
export function useAppElement(element: ProseElement<AnySchema>): AppElement;
export function useAppElement(
  elementOrName: string | ProseElement<AnySchema>,
): AppElement {
  let schemaName: string;

  if (typeof elementOrName === 'string') {
    schemaName = elementOrName;
  } else {
    schemaName = elementOrName.schemaName;
  }

  const { appElements } = useProseContext();
  const appElement = appElements[schemaName];

  if (!appElement) {
    throw new ProseError(`No AppElement found for schema "${schemaName}"!`);
  }

  return appElement;
}
