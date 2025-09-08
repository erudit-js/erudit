import { writeFileSync } from 'node:fs';
import { addImports, addServerImports } from 'nuxt/kit';

import { defineEruditConfig } from '../globals/eruditConfig';
import { eruditPublic, projectPublic } from '../globals/public';
import type { EruditRuntimeConfig } from '../../../shared/types/runtimeConfig';

//
// Module
//

export async function registerModuleGlobals() {
    const moduleGlobals = {
        defineEruditConfig,
        projectPublic,
        eruditPublic,
    };

    Object.assign(globalThis, moduleGlobals);
}

//
// App
//

export async function registerAppGlobals(runtimeConfig: EruditRuntimeConfig) {
    addImports([
        {
            name: 'ERUDIT',
            from: `${runtimeConfig.paths.app}/plugins/appSetup/global`,
        },
        {
            name: 'eruditPublic',
            from: `${runtimeConfig.paths.module}/globals/public`,
        },
    ]);
}

//
// Server
//

export async function registerServerGlobals(
    runtimeConfig: EruditRuntimeConfig,
) {
    addServerImports([
        {
            name: 'ERUDIT',
            from: `${runtimeConfig.paths.server}/global`,
        },
    ]);
}

//
// Content Types
//

export async function registerGlobalContentTypes(
    runtimeConfig: EruditRuntimeConfig,
) {
    interface ContentType {
        name: string;
        from: string;
    }

    const contentTypes: ContentType[] = [];

    const addContentTypes = (types: ContentType[]) => {
        contentTypes.push(...types);
    };

    //
    //
    //

    addContentTypes([
        {
            name: 'defineEruditConfig',
            from: `${runtimeConfig.paths.module}/globals/eruditConfig`,
        },
        {
            name: 'projectPublic',
            from: `${runtimeConfig.paths.module}/globals/public`,
        },
        {
            name: 'eruditPublic',
            from: `${runtimeConfig.paths.module}/globals/public`,
        },
        {
            name: 'defineContributor',
            from: `${runtimeConfig.paths.module}/globals/contributor`,
        },
        {
            name: 'defineSponsor',
            from: `${runtimeConfig.paths.module}/globals/sponsor`,
        },
    ]);

    //
    //
    //

    let erudit_d_ts = 'export {}\n\ndeclare global {\n';

    for (const contentType of contentTypes) {
        erudit_d_ts += `    const ${contentType.name}: typeof import('${contentType.from}')['${contentType.name}']\n`;
    }

    erudit_d_ts += `}\n`;

    writeFileSync(
        `${runtimeConfig.paths.build}/types/erudit.d.ts`,
        erudit_d_ts,
    );

    writeFileSync(
        `${runtimeConfig.paths.build}/types/augmentedConfigs.d.ts`,
        runtimeAugmentations(),
    );
}

//
// Runtime Type Augmentations
//

// TODO: Find a more nice way to do this!

function runtimeAugmentations() {
    return `
import type { ContentConfigBook } from '@erudit-js/cog/schema';

type RuntimeContentConfigBook = ContentConfigBook & {
    contributors?: RuntimeContributor[];
    dependencies?: RuntimeContentId[];
}

declare global {
    function defineBook(book: RuntimeContentConfigBook) {
        return book;
    }
}

export {}
    `;
}
