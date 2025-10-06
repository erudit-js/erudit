import type { Nuxt } from 'nuxt/schema';
import { addTemplate, findPath } from 'nuxt/kit';
import chalk from 'chalk';
import { writeFileSync } from 'node:fs';
import type { GlobalElementDefinition } from '@erudit-js/prose';
import { paragraphName } from '@erudit-js/prose/default/paragraph/index';
import { headingName } from '@erudit-js/prose/default/heading/index';
import { spanName } from '@erudit-js/prose/default/span/index';

import { moduleLogger } from '../logger';
import type { EruditRuntimeConfig } from '../../../shared/types/runtimeConfig';

type ElementImports = {
    global: string;
    app: string | undefined;
};

type BuiltinElements = Record<string, ElementImports>;

const BUILTIN_ELEMENTS: BuiltinElements = {
    [paragraphName]: {
        app: '@erudit-js/prose/default/paragraph/app',
        global: '@erudit-js/prose/default/paragraph/global',
    },
    [headingName]: {
        app: '@erudit-js/prose/default/heading/app',
        global: '@erudit-js/prose/default/heading/global',
    },
    [spanName]: {
        app: '@erudit-js/prose/default/span/app',
        global: '@erudit-js/prose/default/span/global',
    },
};

type ElementTagTypeof = {
    import: string;
    index: number | undefined;
};

type TagName2Typeof = Record<string, ElementTagTypeof>;

async function collectElementImports(
    runtimeConfig: EruditRuntimeConfig,
): Promise<ElementImports[]> {
    const imports: ElementImports[] = [];

    // Built-in elements
    for (const element of Object.values(BUILTIN_ELEMENTS)) {
        imports.push({
            global: element.global,
            app: element.app,
        });
    }

    // Project elements
    for (const elementPath of runtimeConfig.project.elements) {
        const globalModulePath = elementPath + '.global';
        const appModulePath = elementPath + '.app';

        const globalAbsPath = await findPath(globalModulePath, {
            cwd: runtimeConfig.paths.project,
            extensions: ['.ts', '.js'],
        });

        const appAbsPath = await findPath(appModulePath, {
            cwd: runtimeConfig.paths.project,
            extensions: ['.ts', '.js'],
        });

        if (!globalAbsPath) {
            throw new Error(
                `Failed to detect ".global" part of project prose element "${elementPath}"!`,
            );
        }

        let resolvedGlobalModulePath = globalModulePath;
        if (globalModulePath.startsWith('./')) {
            resolvedGlobalModulePath = globalModulePath.replace(
                './',
                runtimeConfig.paths.project + '/',
            );
        }

        let resolvedAppModulePath: string | undefined = undefined;
        if (appAbsPath) {
            resolvedAppModulePath = appModulePath;
            if (appModulePath.startsWith('./')) {
                resolvedAppModulePath = appModulePath.replace(
                    './',
                    runtimeConfig.paths.project + '/',
                );
            }
        }

        imports.push({
            global: resolvedGlobalModulePath,
            app: resolvedAppModulePath,
        });
    }

    return imports;
}

export async function setupProseElements(
    nuxt: Nuxt,
    runtimeConfig: EruditRuntimeConfig,
) {
    const imports = await collectElementImports(runtimeConfig);
    const elementName2Import: Record<string, string> = {};
    const tagName2Typeof: TagName2Typeof = {};

    for (const elementImport of imports) {
        try {
            const rawDefault = (await import(elementImport.global)).default;
            const isDefinitionArray = Array.isArray(rawDefault);
            const definitions: GlobalElementDefinition[] = isDefinitionArray
                ? rawDefault
                : [rawDefault];

            for (let i = 0; i < definitions.length; i++) {
                const definition = definitions[i]!;

                if (definition.name in elementName2Import) {
                    throw new Error(
                        `Prose element name "${definition.name}" is already registered by another element!`,
                    );
                }

                elementName2Import[definition.name] = elementImport.global;

                if (definition.tags) {
                    for (const tagName of Object.keys(definition.tags)) {
                        if (tagName in tagName2Typeof) {
                            throw new Error(
                                `Prose element tag name "<${tagName}>" is already registered by "${tagName2Typeof[tagName]!.import}"!`,
                            );
                        }

                        tagName2Typeof[tagName] = {
                            import: elementImport.global,
                            index: isDefinitionArray ? i : undefined,
                        };
                    }
                }
            }
        } catch (error) {
            throw new Error(
                `Failed to setup prose element from "${elementImport.global}":\n\n${error}`,
            );
        }
    }

    await setupGlobalTemplate(
        nuxt,
        runtimeConfig,
        imports.map((i) => i.global),
    );
    await setupGlobalTagTypes(runtimeConfig, tagName2Typeof);
    await setupAppTemplate(
        nuxt,
        runtimeConfig,
        imports.map((i) => i.app).filter((j): j is string => Boolean(j)),
    );
}

async function setupGlobalTemplate(
    nuxt: Nuxt,
    runtimeConfig: EruditRuntimeConfig,
    imports: string[],
) {
    const templateImportName = (i: number) => `global_elements_${i}`;
    const importNames = imports.map((_, i) => templateImportName(i));

    const template = `
import type { GlobalElementDefinitions } from '@erudit-js/prose';

${importNames.map((importName, i) => `import ${importName} from '${imports[i]}';`).join('\n')}

const elements = [
    ${importNames.join(',\n    ')}
].flatMap(e => (Array.isArray(e) ? e : [e]));

Object.assign(globalThis, {
    ...Object.fromEntries(
        elements
            .flatMap(element => element.tags ? Object.entries(element.tags) : [])
            .map(([tagName, tag]) => [tagName, tag])
    ),
});

export default Object.fromEntries(elements.map((e) => [e.name, e])) as GlobalElementDefinitions;
    `.trim();

    addTemplate({
        write: true,
        filename: '#erudit/prose/global.ts',
        getContents() {
            return template;
        },
    });

    const alias = (nuxt.options.alias ||= {});
    alias['#erudit/prose/global'] =
        runtimeConfig.paths.build + `/nuxt/.nuxt/#erudit/prose/global.ts`;
}

async function setupGlobalTagTypes(
    runtimeConfig: EruditRuntimeConfig,
    tagName2Typeof: TagName2Typeof,
) {
    const content = `
declare global {
${Object.entries(tagName2Typeof)
    .map(
        ([tagName, info]) =>
            `    const ${tagName}: typeof import('${info.import}')${info.index !== undefined ? `['default'][${info.index}]` : "['default']"}['tags']['${tagName}'];`,
    )
    .join('\n')}
}

export {};
    `.trim();

    writeFileSync(runtimeConfig.paths.build + '/types/tags.d.ts', content);

    moduleLogger.info(
        `Registered ${Object.keys(tagName2Typeof).length} prose tags:${chalk.gray(
            '\n' +
                Object.keys(tagName2Typeof)
                    .map((t) => `<${t}>`)
                    .join(' '),
        )}`,
    );
}

async function setupAppTemplate(
    nuxt: Nuxt,
    runtimeConfig: EruditRuntimeConfig,
    appImports: string[],
) {
    const templateImportName = (i: number) => `app_elements_${i}`;
    const importNames = appImports.map((_, i) => templateImportName(i));

    const template = `
import type { AppElementDefinitions } from '@erudit-js/prose/app';

${importNames.map((importName, i) => `import ${importName} from '${appImports[i]}';`).join('\n')}

const elements = [
    ${importNames.join(',\n    ')}
].flatMap((e: any) => Array.isArray(e) ? e : [e]);

export default Object.fromEntries(
    elements.map((e: any) => [e.name, e])
) as AppElementDefinitions;
    `.trim();

    addTemplate({
        write: true,
        filename: '#erudit/prose/app.ts',
        getContents() {
            return template;
        },
    });

    const alias = (nuxt.options.alias ||= {});
    alias['#erudit/prose/app'] =
        runtimeConfig.paths.build + `/nuxt/.nuxt/#erudit/prose/app.ts`;
}
