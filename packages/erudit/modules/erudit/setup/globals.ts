import { writeFileSync } from 'node:fs';
import { addImports, addServerImports } from 'nuxt/kit';
import { sn } from 'unslash';

import { defineEruditConfig } from '../globals/eruditConfig';
import { eruditPublic, projectPublic } from '../globals/public';
import { ERUDIT_PATH, PROJECT_PATH } from '../env';

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

export async function registerAppGlobals() {
    addImports([
        {
            name: 'ERUDIT',
            from: sn(ERUDIT_PATH, 'app/plugins/appSetup/global'),
        },
        {
            name: 'eruditPublic',
            from: sn(ERUDIT_PATH, 'modules/erudit/globals/public'),
        },
        {
            name: 'defineProblemScript',
            from: sn(ERUDIT_PATH, 'modules/erudit/globals/problem'),
        },
    ]);
}

//
// Server
//

export async function registerServerGlobals() {
    addServerImports([
        {
            name: 'ERUDIT',
            from: sn(ERUDIT_PATH, 'server/erudit/global'),
        },
        {
            name: '$CONTRIBUTOR',
            from: sn(ERUDIT_PATH, 'server/erudit/contributors/global'),
        },
        {
            name: '$CONTENT',
            from: sn(ERUDIT_PATH, 'server/erudit/content/global'),
        },
        {
            name: 'defineContributor',
            from: sn(ERUDIT_PATH, 'modules/erudit/globals/contributor'),
        },
        {
            name: 'defineSponsor',
            from: `@erudit-js/core/sponsor`,
        },
        {
            name: 'defineCameo',
            from: `@erudit-js/core/cameo`,
        },
        {
            name: 'defineBook',
            from: sn(ERUDIT_PATH, 'modules/erudit/globals/content'),
        },
        {
            name: 'defineTopic',
            from: sn(ERUDIT_PATH, 'modules/erudit/globals/content'),
        },
        {
            name: 'definePage',
            from: sn(ERUDIT_PATH, 'modules/erudit/globals/content'),
        },

        {
            name: 'defineGroup',
            from: sn(ERUDIT_PATH, 'modules/erudit/globals/content'),
        },
        {
            name: 'defineProse',
            from: sn(ERUDIT_PATH, 'modules/erudit/globals/prose'),
        },
        {
            name: 'Include',
            from: `@erudit-js/prose`,
        },
    ]);
}

//
// Content Types
//

export async function registerGlobalContentTypes() {
    interface ContentType {
        name: string;
        from: string;
    }

    const contentTypes: ContentType[] = [];
    const contentTypeAliases: ContentType[] = [];

    const addContentTypes = (types: ContentType[]) => {
        contentTypes.push(...types);
    };

    const addContentTypeAliases = (types: ContentType[]) => {
        contentTypeAliases.push(...types);
    };

    //
    //
    //

    addContentTypes([
        {
            name: 'defineEruditConfig',
            from: sn(ERUDIT_PATH, 'modules/erudit/globals/eruditConfig'),
        },
        {
            name: 'projectPublic',
            from: sn(ERUDIT_PATH, 'modules/erudit/globals/public'),
        },
        {
            name: 'eruditPublic',
            from: sn(ERUDIT_PATH, 'modules/erudit/globals/public'),
        },
        {
            name: 'defineContributor',
            from: sn(ERUDIT_PATH, 'modules/erudit/globals/contributor'),
        },
        {
            name: 'defineSponsor',
            from: `@erudit-js/core/sponsor`,
        },
        {
            name: 'defineCameo',
            from: `@erudit-js/core/cameo`,
        },
        {
            name: 'defineProblemScript',
            from: sn(ERUDIT_PATH, 'modules/erudit/globals/problem'),
        },
        {
            name: 'defineBook',
            from: sn(ERUDIT_PATH, 'modules/erudit/globals/content'),
        },
        {
            name: 'defineTopic',
            from: sn(ERUDIT_PATH, 'modules/erudit/globals/content'),
        },
        {
            name: 'definePage',
            from: sn(ERUDIT_PATH, 'modules/erudit/globals/content'),
        },
        {
            name: 'defineGroup',
            from: sn(ERUDIT_PATH, 'modules/erudit/globals/content'),
        },
        {
            name: 'defineProse',
            from: sn(ERUDIT_PATH, 'modules/erudit/globals/prose'),
        },
        {
            name: 'Include',
            from: `@erudit-js/prose`,
        },
    ]);

    addContentTypeAliases([
        {
            name: 'ProblemRandom',
            from: '@erudit-js/prose/elements/problem/rng',
        },
    ]);

    //
    //
    //

    let erudit_d_ts = 'export {}\n\ndeclare global {\n';

    for (const contentType of contentTypes) {
        erudit_d_ts += `    const ${contentType.name}: typeof import('${contentType.from}')['${contentType.name}']\n`;
    }

    for (const contentType of contentTypeAliases) {
        erudit_d_ts += `    type ${contentType.name} = import('${contentType.from}').${contentType.name}\n`;
    }

    erudit_d_ts += `}\n`;

    writeFileSync(sn(PROJECT_PATH, '.erudit/types/erudit.d.ts'), erudit_d_ts);
}
