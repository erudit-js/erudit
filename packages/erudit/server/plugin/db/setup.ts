import { rmSync } from 'node:fs';
import { DataSource } from 'typeorm';

import { PROJECT_DIR } from '#erudit/globalPaths';
import { ERUDIT_SERVER } from '@server/global';
import { logger } from '@server/logger';

// Database Entities
import { DbContributor } from './entities/Contributor';
import { DbBook } from './entities/Book';
import { DbContent } from './entities/Content';
import { DbContribution } from './entities/Contribution';
import { DbGroup } from './entities/Group';
import { DbHash } from './entities/Hash';
import { DbTopic } from './entities/Topic';
import { DbUnique } from './entities/Unique';
import { DbFile } from './entities/File';

export async function setupDatabase() {
    rmSync(PROJECT_DIR + '/.erudit/data.sqlite', { force: true });

    ERUDIT_SERVER.DB = new DataSource({
        type: 'sqlite',
        enableWAL: true,
        database: PROJECT_DIR + '/.erudit/data.sqlite',
        synchronize: true,
        dropSchema: true,
        entities: [
            DbBook,
            DbContent,
            DbContribution,
            DbContributor,
            DbGroup,
            DbHash,
            DbTopic,
            DbUnique,
            DbFile,
        ],
    });

    try {
        // Wait before creating connection in case fast server restarts
        // Otherwise, it may crash the whole Node process
        await new Promise((resolve) => setTimeout(resolve, 500));
        await ERUDIT_SERVER.DB.initialize();
    } catch (error) {
        logger.error('Error creating database connection:', error);
    }
}
