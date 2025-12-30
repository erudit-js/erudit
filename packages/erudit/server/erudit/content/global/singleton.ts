import { createGlobalContentProxy } from '@erudit-js/core/content/global';

export const $CONTENT = createGlobalContentProxy();

(globalThis as any).$CONTENT = $CONTENT;
