import { debug, logger } from '@server/logger';

import { setup } from './setup';
import { setupLanguage } from './jobs/language';
import { buildContributors } from './jobs/contributors';
import { buildNav } from './jobs/nav';
import { buildContent } from './jobs/content/generic';
import { resetDatabase } from '../db/reset';

let initial = true;

export async function build() {
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
