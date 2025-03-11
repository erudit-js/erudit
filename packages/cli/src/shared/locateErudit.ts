import { existsSync } from 'node:fs';
import chalk from 'chalk';
import { consola } from 'consola';
import { resolvePaths } from '@erudit-js/cog/kit';

let eruditPath: string;

export function locateErudit(projectPath: string) {
    if (eruditPath) return eruditPath;

    const warn = (_path: string) => {
        consola.warn(`Erudit is not found at ${chalk.yellowBright(_path)}!`);
    };

    // Monorepo "erudit" package

    const monorepoEruditPath = resolvePaths(process.cwd(), './packages/erudit');

    if (existsSync(monorepoEruditPath))
        return (eruditPath = monorepoEruditPath);

    // Project directory "node_modules"

    const nodeModulesEruditPath = `${projectPath}/node_modules/erudit`;

    if (existsSync(nodeModulesEruditPath))
        return (eruditPath = nodeModulesEruditPath);

    // Current working directory "node_modules"

    const cwdModulesEruditPath =
        resolvePaths(process.cwd()) + '/node_modules/erudit';

    if (existsSync(cwdModulesEruditPath))
        return (eruditPath = cwdModulesEruditPath);

    // Print checked locations

    warn(cwdModulesEruditPath);
    warn(nodeModulesEruditPath);
    warn(monorepoEruditPath);

    throw new Error('Failed to find installed "erudit" package!');
}
