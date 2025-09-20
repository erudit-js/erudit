import { EruditServerChangedFiles } from './build';
import type { EruditServerConfig } from './config';
import { EruditServerContentNav } from './content/nav/types';
import type { EruditServerDatabase } from './db/types';
import type { EruditServerImporter } from './importer';
import type { EruditServerLanguage } from './language/types';
import type { EruditServerLogger } from './logger';
import { EruditServerRepository } from './repository';

export const ERUDIT: {
    buildPromise: Promise<void>;
    changedFiles: EruditServerChangedFiles;
    config: EruditServerConfig;
    log: EruditServerLogger;
    language: EruditServerLanguage;
    db: EruditServerDatabase;
    repository: EruditServerRepository;
    contentNav: EruditServerContentNav;
    import: EruditServerImporter;
} = {} as any;
