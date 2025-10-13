import { defineCommand } from 'citty';
import { brandColorLogotype } from '@erudit-js/cog/utils/brandNode';

import { version } from '../../package.json';

// Sub commands
import { init } from './init';
import { prepare } from './prepare';
import { dev } from './dev';
import { build } from './build';
import { preview } from './preview';
import { launch } from './launch';
import { generate } from './generate';

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
    },
});
