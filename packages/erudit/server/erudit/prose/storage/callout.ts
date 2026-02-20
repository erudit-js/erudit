import type { ProseStorage, ToProseElement } from 'tsprose';
import type { CalloutSchema } from '@erudit-js/prose/elements/callout/core';
import { createCalloutStorage as _createCalloutStorage } from '@erudit-js/prose/elements/callout/storage';

export async function createCalloutStorage(
  element: ToProseElement<CalloutSchema>,
  storage: ProseStorage,
) {
  const runtimeConfig = useRuntimeConfig();

  storage[element.storageKey!] = _createCalloutStorage(
    ERUDIT.paths.project(),
    runtimeConfig.app.baseURL,
    element.data.iconSrc,
  );
}
