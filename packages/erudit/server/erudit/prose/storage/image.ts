import type { GenericStorage, ProseElement } from '@jsprose/core';
import type {
  imageSchema,
  ImageStorage,
} from '@erudit-js/prose/elements/image/core';
import { createImageStorage as _createImageStorage } from '@erudit-js/prose/elements/image/storage';

export async function createImageStorage(
  element: ProseElement<typeof imageSchema>,
  storage: GenericStorage,
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
