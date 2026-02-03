import dotenv from 'dotenv';
import type { EruditMode } from '@erudit-js/core/mode';

import { CONFIG } from '../config.js';
import { version } from '../inject.js';
import type { UrlProps } from './urlProps.js';

export function loadEnvFiles(files: string[]): void {
  dotenv.config({
    quiet: true,
    path: files,
  });
}
