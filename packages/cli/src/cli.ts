import { runMain } from 'citty';

import { CONFIG } from './config.js';
import { main } from './commands/main.js';

export function runCli(absEruditPath: string) {
  CONFIG.ERUDIT_PATH = absEruditPath;
  runMain(main);
}
