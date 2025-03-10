import { addImports } from 'nuxt/kit';

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
        {
            name: 'defineBitranConfig',
            from: eruditPath('globals/bitran'),
        },
        {
            name: 'defineBitranElement',
            from: eruditPath('globals/bitran'),
        },
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
}
