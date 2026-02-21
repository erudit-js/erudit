import type { Schema, ToProseElement } from 'tsprose';

import type { ProseAppElement } from '../appElement.js';
import { useProseContext } from './context.js';
import { EruditProseError } from '../../error.js';

export function useAppElement(schemaName: string): ProseAppElement;
export function useAppElement(element: ToProseElement<Schema>): ProseAppElement;
export function useAppElement(
  elementOrName: string | ToProseElement<Schema>,
): ProseAppElement {
  let schemaName: string;

  if (typeof elementOrName === 'string') {
    schemaName = elementOrName;
  } else {
    schemaName = elementOrName.schema.name;
  }

  const { appElements } = useProseContext();
  const appElement = appElements[schemaName];

  if (!appElement) {
    throw new EruditProseError(
      `No AppElement found for schema "${schemaName}"!`,
    );
  }

  return appElement;
}
