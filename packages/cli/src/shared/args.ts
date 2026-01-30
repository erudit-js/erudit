import type { ArgDef } from 'citty';
import { consola } from 'consola';
import chalk from 'chalk';

import { CONFIG } from '../config.js';
import { resolvePath } from './path.js';

export const projectPathArg = {
    projectPath: {
        type: 'positional',
        description: 'Erudit project location',
        required: false,
        default: '.',
    },
} satisfies { projectPath: ArgDef };

export const contentTargetsArg = {
    target: {
        type: 'string',
        description: 'Content targets to process',
        required: false,
        default: '',
    },
} satisfies { target: ArgDef };

export const nitroPresetArg = {
    preset: {
        type: 'string',
        required: false,
        description: '(Nuxt Build Flag) Nitro preset to use for building',
    },
} satisfies { preset: ArgDef };

export function resolveArgPaths(projectPath: string) {
    consola.start('Resolving project path...');
    projectPath = resolvePath(projectPath);
    consola.success('Resolved project path:', chalk.greenBright(projectPath));

    consola.start('Resolving Erudit Nuxt Layer path...');
    consola.success(
        'Resolved Erudit path:',
        chalk.greenBright(CONFIG.ERUDIT_PATH),
    );

    return {
        projectPath,
    };
}
