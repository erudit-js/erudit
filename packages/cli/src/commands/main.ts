import { defineCommand } from 'citty';
import { brandColorLogotype } from '@erudit-js/core/brandTerminal';

// Sub commands
import { init } from './init.js';
import { prepare } from './prepare.js';
import { dev } from './dev.js';
import { build } from './build.js';
import { preview } from './preview.js';
import { launch } from './launch.js';
import { generate } from './generate.js';

const version = '{{ VERSION }}';

export const main = defineCommand({
    meta: {
        name: 'Erudit CLI',
        description: 'Command Line Interface for Erudit!',
        version,
    },
    subCommands: {
        init,
        prepare,
        dev,
        build,
        generate,
        preview,
        launch,
    },
    setup() {
        console.log(brandColorLogotype);
        console.log(`Version ${version}\n`);
    },
});
