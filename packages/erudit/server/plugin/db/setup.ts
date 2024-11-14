import { DataSource } from 'typeorm';

import { PROJECT_DIR } from '#erudit/globalPaths';
import { ERUDIT_SERVER } from '@server/global';

// Database Entities
import { DbContributor } from './entities/Contributor';
import { DbBook } from './entities/Book';
import { DbContent } from './entities/Content';
import { DbContribution } from './entities/Contribution';
import { DbGroup } from './entities/Group';
import { DbHash } from './entities/Hash';
import { DbTopic } from './entities/Topic';
import { DbUnique } from './entities/Unique';

export async function setupDatabase() {
    ERUDIT_SERVER.DB = new DataSource({
        type: 'sqlite',
        database: PROJECT_DIR + '/.erudit/data.sqlite',
        synchronize: true,
        entities: [
            DbBook,
            DbContent,
            DbContribution,
            DbContributor,
            DbGroup,
            DbHash,
            DbTopic,
            DbUnique,
        ],
    });

    await ERUDIT_SERVER.DB.initialize();
}
