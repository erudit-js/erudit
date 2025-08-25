import type { EruditServerConfig } from './config';
import type { EruditServerDatabase } from './db/types';
import type { EruditServerImporter } from './importer';
import type { EruditServerLanguage } from './language/types';
import type { EruditServerLogger } from './logger';
import { EruditServerRepository } from './repository';

export const ERUDIT: {
    buildPromise: Promise<void>;
    config: EruditServerConfig;
    log: EruditServerLogger;
    language: EruditServerLanguage;
    db: EruditServerDatabase;
    repository: EruditServerRepository;
    import: EruditServerImporter;
} = {} as any;
