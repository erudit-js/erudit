import { resetDatabase } from '@server/db/reset';
import { ERUDIT_SERVER } from '@server/global';
import { debug, logger } from '@server/logger';

import { setup } from './setup';
import { setupLanguage } from './jobs/language';
import { buildContributors } from './jobs/contributors';
import { buildNav } from './jobs/nav';
import { buildContent } from './jobs/content/generic';

let initial = true;

async function _build() {
    debug.start('Building data...');

    if (initial) {
        await setup();
        initial = false;
    }

    await resetDatabase();
    await setupLanguage();
    await buildContributors();
    await buildNav();
    await buildContent();

    logger.success('Build successful!');
}

export async function build() {
    ERUDIT_SERVER.BUILD_PROMISE = _build();
}
