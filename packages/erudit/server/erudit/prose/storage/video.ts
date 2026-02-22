import type { ToProseElement } from 'tsprose';
import type {
  VideoSchema,
  VideoStorage,
} from '@erudit-js/prose/elements/video/core';
import { createVideoStorage as _createVideoStorage } from '@erudit-js/prose/elements/video/storage';

export function createVideoStorage(
  element: ToProseElement<VideoSchema>,
): VideoStorage {
  const runtimeConfig = useRuntimeConfig();

  return _createVideoStorage(
    ERUDIT.paths.project(),
    runtimeConfig.app.baseURL,
    element.data.src,
  );
}
