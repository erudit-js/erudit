import type { GenericStorage, ProseElement } from '@jsprose/core';
import type { videoSchema } from '@erudit-js/prose/elements/video/core';
import { createVideoStorage as _createVideoStorage } from '@erudit-js/prose/elements/video/storage';

export async function createVideoStorage(
  element: ProseElement<typeof videoSchema>,
  storage: GenericStorage,
) {
  const runtimeConfig = useRuntimeConfig();

  storage[element.storageKey!] = _createVideoStorage(
    ERUDIT.paths.project(),
    runtimeConfig.app.baseURL,
    element.data.src,
  );
}
