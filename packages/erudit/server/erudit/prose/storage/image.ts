import type { ProseStorage, ToProseElement } from 'tsprose';
import type {
  ImageSchema,
  ImageStorage,
} from '@erudit-js/prose/elements/image/core';
import { createImageStorage as _createImageStorage } from '@erudit-js/prose/elements/image/storage';

export async function createImageStorage(
  element: ToProseElement<ImageSchema>,
  storage: ProseStorage,
) {
  const runtimeConfig = useRuntimeConfig();

  const imageAbsPath = element.data.src;
  const imageStorage = await _createImageStorage(
    ERUDIT.paths.project(),
    runtimeConfig.app.baseURL,
    imageAbsPath,
  );

  storage[element.storageKey!] = imageStorage satisfies ImageStorage;
}
