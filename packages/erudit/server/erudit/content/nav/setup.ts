import * as repository from './repository';

export async function setupServerContentNav() {
    ERUDIT.contentNav = {
        nodes: [],
        ...repository,
    };

    ERUDIT.log.success('Content navigation setup complete!');
}
