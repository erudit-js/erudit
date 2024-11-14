import { consola } from 'consola';
import { defineCommand } from 'citty';

import { logCommand } from '../shared/log';
import { prepare as _prepare } from '../shared/prepare';
import { spawnNuxt } from '../shared/nuxt';
import { eruditPathArg, projectPathArg, resolveArgPaths } from '../shared/args';

export const prepare = defineCommand({
    meta: {
        name: 'Prepare',
        description:
            'Creates a .erudit directory in your project and generates build files',
    },
    args: {
        ...projectPathArg,
        ...eruditPathArg,
    },
    async run({ args }) {
        logCommand('prepare');

        const { projectPath, eruditPath } = resolveArgPaths(
            args.projectPath,
            args.eruditPath,
        );

        await _prepare(projectPath, eruditPath);

        consola.start('Generating Nuxt build files...');
        await spawnNuxt('prepare', projectPath);
        consola.success('Nuxt is prepared!');
    },
});
