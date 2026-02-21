import type { ToProseElement, Schema } from 'tsprose';

import { useAppElement } from './appElement.js';

export async function useElementIcon(schemaName: string): Promise<string>;
export async function useElementIcon(
  element: ToProseElement<Schema>,
): Promise<string>;
export async function useElementIcon(
  elementOrName: string | ToProseElement<Schema>,
): Promise<string> {
  const appElement = useAppElement(
    typeof elementOrName === 'string'
      ? elementOrName
      : elementOrName.schema.name,
  );
  return appElement.icon();
}
