import type { ArgDef } from 'citty';
import { consola } from 'consola';
import chalk from 'chalk';

import { resolvePath } from './path';

export const eruditPathArg = {
    eruditPath: {
        type: 'string',
        description: 'Custom Erudit Nuxt Layer location',
        required: false,
        default: 'erudit', // Let `nuxi` find erudit in project dependencies
    },
} satisfies { eruditPath: ArgDef };

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

export function resolveArgPaths(projectPath: string, eruditPath: string) {
    consola.start('Resolving project path...');
    projectPath = resolvePath(projectPath);
    consola.success('Resolved project path:', chalk.greenBright(projectPath));

    consola.start('Resolving Erudit Nuxt Layer path...');
    if (eruditPath === 'erudit') {
        consola.success(`'nuxi' will find Erudit in your dependencies!`);
    } else {
        eruditPath = resolvePath(eruditPath);
        consola.warn(
            'Custom Erudit Nuxt Layer path will be used: ' +
                chalk.yellowBright(eruditPath),
        );
    }

    return {
        projectPath,
        eruditPath,
    };
}
