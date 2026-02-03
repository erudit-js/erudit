import type { EruditMode } from '@erudit-js/core/mode';

export const ERUDIT_COMMAND = process.env.ERUDIT_COMMAND;
export const BASE_URL = process.env.NUXT_APP_BASE_URL;
export const ERUDIT_PATH = process.env.NUXT_ERUDIT_PATH!;
export const PROJECT_PATH = process.env.NUXT_PROJECT_PATH!;
export const ERUDIT_MODE = process.env.NUXT_PUBLIC_ERUDIT_MODE as EruditMode;
export const ERUDIT_VERSION = process.env.NUXT_PUBLIC_ERUDIT_VERSION!;
