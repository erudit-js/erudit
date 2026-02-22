import { defineCommand } from 'citty';
import type { EruditMode } from '@erudit-js/core/mode';

import { projectPathArg } from '../shared/args.js';
import {
  logProjectPath,
  normalizeProjectPath,
  retrieveProjectPath,
} from '../shared/projectPath.js';
import { prepareProject } from '../shared/prepare.js';
import { spawnNuxt } from '../shared/nuxt.js';
import { CONFIG } from '../config.js';
import { version } from '../inject.js';

export const build = defineCommand({
  meta: {
    name: 'build',
    description:
      'Builds Erudit project that can be launched for fast content writing',
  },
  args: {
    ...projectPathArg,
  },
  async run({ args }) {
    const absProjectPath = normalizeProjectPath(
      retrieveProjectPath(args.projectPath),
    );
    logProjectPath(absProjectPath);

    await prepareProject({
      absProjectPath,
    });

    console.log('Building Erudit Nuxt Layer...');
    await spawnNuxt({
      command: 'build',
      absProjectPath,
      env: {
        ERUDIT_COMMAND: 'build',
        NUXT_ERUDIT_PATH: CONFIG.ERUDIT_PATH,
        NUXT_PROJECT_PATH: absProjectPath,
        NUXT_PUBLIC_ERUDIT_MODE: <EruditMode>'write',
        NUXT_PUBLIC_ERUDIT_VERSION: version,
      },
    });
  },
});
