import { existsSync } from 'node:fs';
import { spawn } from 'node:child_process';
import { defineCommand } from 'citty';
import type { EruditMode } from '@erudit-js/core/mode';

import {
  basePathArg,
  contentTargetsArg,
  projectPathArg,
  siteUrlArg,
  reloadArg,
} from '../shared/args.js';
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
import { cliError } from '../shared/cliError.js';
import { CONFIG } from '../config.js';
import { version } from '../inject.js';

export const launch = defineCommand({
  meta: {
    name: 'launch',
    description: 'Launchs already built Erudit project for content writing',
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

    loadEnvFiles([`${absProjectPath}/.env.prod`, `${absProjectPath}/.env`]);

    const urlProps = normalizeUrlProps(
      retrieveUrlProps(args.siteUrl, args.basePath),
    );
    logUrlProps(urlProps);

    const logProjectPathStr = args.projectPath ? ` "${args.projectPath}"` : '';
    const didYouRun = `Did you run 'erudit build${logProjectPathStr}'?`;

    const serverIndexPath = `${absProjectPath}/.output/server/index.mjs`;

    if (!existsSync(serverIndexPath)) {
      throw cliError(
        `Failed to find built Erudit project at "${absProjectPath}"!\n${didYouRun}`,
      );
    }

    console.log('Launching Erudit project...');
    spawn('node', [serverIndexPath], {
      stdio: 'inherit',
      env: {
        ERUDIT_COMMAND: 'launch',
        NUXT_ERUDIT_PATH: CONFIG.ERUDIT_PATH,
        NUXT_PROJECT_PATH: absProjectPath,
        NUXT_CONTENT_TARGETS: args.target,
        NUXT_PUBLIC_ERUDIT_MODE: <EruditMode>'write',
        NUXT_PUBLIC_ERUDIT_RELOAD: String(args.reload ?? true),
        NUXT_PUBLIC_ERUDIT_VERSION: version,
        NUXT_APP_BASE_URL: urlProps.basePath,
        NUXT_PUBLIC_SITE_URL: urlProps.siteUrl,
      },
    });
  },
});
