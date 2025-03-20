import { defineCommand } from 'citty';
import { brandColorLogotype } from '@erudit-js/cog/utils/brandNode';

import { version } from '../../package.json';

// Sub commands
import { init } from './init';
import { prepare } from './prepare';
import { dev } from './dev';
import { generate } from './generate';
import { preview } from './preview';

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
        generate,
        preview,
    },
    setup() {
        console.log(brandColorLogotype);
    },
});
