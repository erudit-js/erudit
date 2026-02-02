import { defineCommand } from 'citty';
import chalk from 'chalk';
import { brandColorLogotype } from '@erudit-js/core/brandTerminal';

import { version } from '../inject.js';
import { logCommand } from '../shared/logCommand.js';
import { CONFIG } from '../config.js';

// Sub commands
import { prepare } from './prepare.js';
import { dev } from './dev.js';
import { build } from './build.js';
import { launch } from './launch.js';
import { generate } from './generate.js';
import { preview } from './preview.js';

export const main = defineCommand({
    meta: {
        name: 'erudit',
        description: 'CLI for Erudit',
        version,
    },
    subCommands: {
        prepare,
        dev,
        build,
        launch,
        generate,
        preview,
    },
    setup({ args }) {
        console.log(brandColorLogotype);
        console.log(`Version: ${chalk.bold.cyan(version)}`);
        if (args._[0]) {
            logCommand(args._[0]);
        }
        console.log(`Erudit path: ${chalk.bold.cyan(CONFIG.ERUDIT_PATH)}`);
    },
});
