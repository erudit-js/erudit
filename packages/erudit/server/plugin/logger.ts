import chalk from 'chalk';
import { createConsola } from 'consola';
import { brandColorTitle } from 'erudit-cog/utils/brandNode';

import eruditConfig from '#erudit/config';

// TODO: Consola has buggy behaviour when called inside Nitro
// @see https://github.com/nitrojs/nitro/issues/3079

export const logger = createConsola({
    defaults: {
        //tag: brandColorTitle + ' Server',
        message: chalk.gray(`[${brandColorTitle} Server]`),
    },
});

export const debug = createConsola({
    defaults: {
        //tag: brandColorTitle + ' Server Debug',
        message: chalk.gray(`[${brandColorTitle} Server Debug]`),
        level: eruditConfig?.debug?.log ? 3 : -999,
    },
});
