import { addImports, addServerImports } from 'nuxt/kit';

import { eruditPath } from '@erudit/globalPath';

export function setupGlobalImports() {
    addImports([
        {
            name: 'defineEruditConfig',
            from: eruditPath('globals/erudit'),
        },
        {
            name: 'defineContributor',
            from: eruditPath('globals/contributor'),
        },
        // Bitran
        ...(() => {
            const imports = ['defineAppBitran'];
            return imports.map((name) => ({
                name,
                from: eruditPath(`globals/bitran`),
            }));
        })(),
        // Content
        ...(() => {
            const imports = [
                'defineBook',
                'defineGroup',
                'defineTopic',
                'defineContentReferences',
            ];
            return imports.map((name) => ({
                name,
                from: eruditPath(`globals/content`),
            }));
        })(),
        // Problems Generation
        {
            name: 'defineProblemGenerator',
            from: '@erudit-js/bitran-elements/problem/generator',
        },
        // Helper Asset Path Functions
        ...(() => {
            const imports = [
                'eruditAsset',
                'contributorAsset',
                'contentAsset',
                'publicAsset',
            ];
            return imports.map((name) => ({
                name,
                from: eruditPath(`shared/asset`),
            }));
        })(),
    ]);

    addServerImports([
        // Bitran
        ...(() => {
            const imports = ['defineServerBitran'];
            return imports.map((name) => ({
                name,
                from: eruditPath(`globals/bitran`),
            }));
        })(),
    ]);
}
