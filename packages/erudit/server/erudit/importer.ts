import { createJiti, type Jiti, type JitiOptions } from 'jiti';

import { defineContributor } from '@erudit/module/globals/contributor';
import { defineSponsor } from '@erudit/module/globals/sponsor';
import { defineBook } from '@erudit/module/globals/book';
import { defineTopic } from '@erudit/module/globals/topic';
import { definePage } from '@erudit/module/globals/page';
import { defineGroup } from '@erudit/module/globals/group';
import { createProseDocument } from '@erudit/module/globals/prose';

export type EruditServerImporter = Jiti['import'];

export let jiti: Jiti;

export async function setupServerImporter() {
    const jitiOptions: JitiOptions = {
        fsCache: false,
        moduleCache: false,
        jsx: {
            runtime: 'automatic',
            importSource: '@erudit-js/prose',
        },
    };

    const defaultJiti = createJiti(ERUDIT.config.paths.project, jitiOptions);
    const defaultTransform = defaultJiti.transform.bind(defaultJiti);

    jiti = createJiti(ERUDIT.config.paths.project, {
        ...jitiOptions,
        extensions: [
            '.ts',
            '.tsx',
            '.js',
            '.jsx',
            '.json',
            '.jpg',
            '.png',
            '.svg',
        ],
        transform: (opts) => {
            if (opts.filename && opts.filename.endsWith('.jpg')) {
                console.log('Transforming JPG:', opts.filename);

                return { code: `exports.default = 'foobar';` };
            }
            return { code: defaultTransform(opts) };
        },
    });

    ERUDIT.import = jiti.import;

    Object.assign(globalThis, {
        defineContributor,
        defineSponsor,
        defineBook,
        defineTopic,
        definePage,
        defineGroup,
        createProseDocument,
    });

    ERUDIT.log.success('Importer setup complete!');
}
