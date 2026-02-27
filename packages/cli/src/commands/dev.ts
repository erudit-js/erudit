import { defineCommand } from 'citty';
import type { EruditMode } from '@erudit-js/core/mode';

import { prepareProject } from '../shared/prepare.js';
import {
  projectPathArg,
  siteUrlArg,
  basePathArg,
  contentTargetsArg,
  reloadArg,
} from '../shared/args.js';
import {
  logProjectPath,
  normalizeProjectPath,
  retrieveProjectPath,
} from '../shared/projectPath.js';
import {
  logUrlProps,
  normalizeUrlProps,
  retrieveUrlProps,
} from '../shared/urlProps.js';
import { loadEnvFiles } from '../shared/env.js';
import { spawnNuxt } from '../shared/nuxt.js';
import { CONFIG } from '../config.js';
import { version } from '../inject.js';

export const dev = defineCommand({
  meta: {
    name: 'dev',
    description: 'Runs Erudit project in development mode',
  },
  args: {
    ...projectPathArg,
    ...siteUrlArg,
    ...basePathArg,
    ...contentTargetsArg,
    ...reloadArg,
  },
  async run({ args }) {
    const absProjectPath = normalizeProjectPath(
      retrieveProjectPath(args.projectPath),
    );
    logProjectPath(absProjectPath);

    loadEnvFiles([`${absProjectPath}/.env.dev`, `${absProjectPath}/.env`]);

    const urlProps = normalizeUrlProps(
      retrieveUrlProps(args.siteUrl, args.basePath),
    );
    logUrlProps(urlProps);

    await prepareProject({
      absProjectPath,
    });

    console.log('Launching Erudit Nuxt Layer in development mode...');
    await spawnNuxt({
      command: 'dev',
      absProjectPath,
      env: {
        ERUDIT_COMMAND: 'dev',
        NUXT_ERUDIT_PATH: CONFIG.ERUDIT_PATH,
        NUXT_PROJECT_PATH: absProjectPath,
        NUXT_CONTENT_TARGETS: args.target ?? '',
        NUXT_PUBLIC_ERUDIT_MODE: <EruditMode>'dev',
        NUXT_PUBLIC_ERUDIT_RELOAD: String(args.reload ?? true),
        NUXT_PUBLIC_ERUDIT_VERSION: version,
        NUXT_APP_BASE_URL: urlProps.basePath,
        NUXT_PUBLIC_SITE_URL: urlProps.siteUrl,
      },
    });
  },
});
