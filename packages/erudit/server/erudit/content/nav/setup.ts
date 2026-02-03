import * as repository from './repository';

export async function setupServerContentNav() {
  ERUDIT.contentNav = {
    id2Node: new Map(),
    id2Books: new Map(),
    id2Root: new Map(),
    short2Full: new Map(),
    ...repository,
  };

  ERUDIT.log.success('Content navigation setup complete!');
}
