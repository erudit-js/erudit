import type { ProseStorage, ToProseElement } from 'tsprose';
import type { VideoSchema } from '@erudit-js/prose/elements/video/core';
import { createVideoStorage as _createVideoStorage } from '@erudit-js/prose/elements/video/storage';

export async function createVideoStorage(
  element: ToProseElement<VideoSchema>,
  storage: ProseStorage,
) {
  const runtimeConfig = useRuntimeConfig();

  storage[element.storageKey!] = _createVideoStorage(
    ERUDIT.paths.project(),
    runtimeConfig.app.baseURL,
    element.data.src,
  );
}
