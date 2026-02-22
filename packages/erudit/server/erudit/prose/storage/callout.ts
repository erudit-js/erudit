import type { ToProseElement } from 'tsprose';
import type {
  CalloutSchema,
  CalloutStorage,
} from '@erudit-js/prose/elements/callout/core';
import { createCalloutStorage as _createCalloutStorage } from '@erudit-js/prose/elements/callout/storage';

export function createCalloutStorage(
  element: ToProseElement<CalloutSchema>,
): CalloutStorage {
  const runtimeConfig = useRuntimeConfig();

  return _createCalloutStorage(
    ERUDIT.paths.project(),
    runtimeConfig.app.baseURL,
    element.data.iconSrc,
  );
}
