import type { EruditMode } from '@erudit-js/core/mode';

import type { EruditServerBuildError, EruditServerChangedFiles } from './build';
import type { EruditServerConfig } from './config';
import type { EruditServerContentNav } from './content/nav/types';
import type { EruditServerDatabase } from './db/types';
import type { EruditServerImporter } from './importer';
import type { EruditServerLanguage } from './language/types';
import type { EruditServerLogger } from './logger';
import type { EruditServerPaths } from './path';
import type { EruditServerRepository } from './repository';

import { registerProseGlobals } from '#erudit/prose/global';

export const ERUDIT: {
  buildError: EruditServerBuildError;
  buildPromise: Promise<void>;
  changedFiles: EruditServerChangedFiles;
  config: EruditServerConfig;
  log: EruditServerLogger;
  language: EruditServerLanguage;
  db: EruditServerDatabase;
  repository: EruditServerRepository;
  contentNav: EruditServerContentNav;
  paths: EruditServerPaths;
  mode: EruditMode;
  import: EruditServerImporter;
} = {} as any;

Object.assign(globalThis, {
  defineContributor,
  defineSponsor,
  defineCameo,
  defineBook,
  defineTopic,
  definePage,
  defineGroup,
  defineProse,
  Include,
});

registerProseGlobals();
