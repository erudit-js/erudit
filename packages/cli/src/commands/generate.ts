import { defineCommand } from 'citty';
import type { EruditMode } from '@erudit-js/core/mode';

import {
  basePathArg,
  contentTargetsArg,
  nitroPresetArg,
  projectPathArg,
  siteUrlArg,
} from '../shared/args.js';
import { prepareProject } from '../shared/prepare.js';
import { spawnNuxt } from '../shared/nuxt.js';
import {
  logProjectPath,
  normalizeProjectPath,
  retrieveProjectPath,
} from '../shared/projectPath.js';
import { loadEnvFiles } from '../shared/env.js';
import {
  logUrlProps,
  normalizeUrlProps,
  retrieveUrlProps,
} from '../shared/urlProps.js';
import { version } from '../inject.js';
import { CONFIG } from '../config.js';

export const generate = defineCommand({
  meta: {
    name: 'generate',
    description:
      'Generates fully static production-ready site from Erudit project',
  },
  args: {
    ...projectPathArg,
    ...siteUrlArg,
    ...basePathArg,
    ...contentTargetsArg,
    ...nitroPresetArg,
  },
  async run({ args }) {
    const absProjectPath = normalizeProjectPath(
      retrieveProjectPath(args.projectPath),
    );
    logProjectPath(absProjectPath);

    loadEnvFiles([`${absProjectPath}/.env.prod`, `${absProjectPath}/.env`]);

    const urlProps = normalizeUrlProps(
      retrieveUrlProps(args.siteUrl, args.basePath),
    );
    logUrlProps(urlProps);

    await prepareProject({
      absProjectPath,
    });

    const nitroPreset = args.nitroPreset || process.env.ERUDIT_NITRO_PRESET;

    console.log('Generating static site from Erudit Nuxt Layer...');
    await spawnNuxt({
      command: 'generate',
      absProjectPath,
      restArgs: nitroPreset ? `--preset ${nitroPreset}` : '',
      env: {
        ERUDIT_COMMAND: 'generate',
        NUXT_ERUDIT_PATH: CONFIG.ERUDIT_PATH,
        NUXT_PROJECT_PATH: absProjectPath,
        NUXT_CONTENT_TARGETS: args.target ?? '',
        NUXT_PUBLIC_ERUDIT_MODE: <EruditMode>'static',
        NUXT_PUBLIC_ERUDIT_VERSION: version,
        NUXT_APP_BASE_URL: urlProps.basePath,
        NUXT_PUBLIC_SITE_URL: urlProps.siteUrl,
      },
    });
  },
});
