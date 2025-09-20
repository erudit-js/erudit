import { writeFileSync } from 'node:fs';
import type { Nuxt } from '@nuxt/schema';
import { addTemplate } from 'nuxt/kit';
import type { GlobalElementDefinition } from '@erudit-js/prose';

import type { EruditRuntimeConfig } from '../../../shared/types/runtimeConfig';
import { moduleLogger } from '../logger';

const BUILTIN_TAGS = [
    {
        name: 'Paragraph',
        module: '@erudit-js/prose/default/paragraph/index',
        exportName: 'Paragraph',
    },
    {
        name: 'H1',
        module: '@erudit-js/prose/default/heading/index',
        exportName: 'H1',
    },
    {
        name: 'H2',
        module: '@erudit-js/prose/default/heading/index',
        exportName: 'H2',
    },
    {
        name: 'H3',
        module: '@erudit-js/prose/default/heading/index',
        exportName: 'H3',
    },
    {
        name: 'Span',
        module: '@erudit-js/prose/default/span/index',
        exportName: 'Span',
    },
] as const;

let registeredElements = 0;
let registeredTags: Map<string, string> = new Map();

function generateGlobalTagTypes(tagMap: Map<string, string>) {
    const dynamic = Array.from(tagMap.entries())
        .map(
            ([tagKey, tagModulePath]) =>
                `    const ${tagKey}: typeof import('${tagModulePath}')['default']['tags']['${tagKey}'];`,
        )
        .join('\n');

    const builtin = BUILTIN_TAGS.map(
        (t) =>
            `    const ${t.name}: typeof import('${t.module}')['${t.exportName}'];`,
    ).join('\n');

    return `declare global {
${dynamic}${dynamic && builtin ? '\n' : ''}${builtin}
}

export {};`;
}

function buildTagImportsAndAssignments(tagMap: Map<string, string>) {
    const dynamicImports = Array.from(tagMap.entries())
        .map(
            ([, elementPath], idx) =>
                `import element${idx} from '${elementPath}';`,
        )
        .join('\n');

    const moduleGroups: Record<string, Set<string>> = {};
    for (const t of BUILTIN_TAGS) {
        (moduleGroups[t.module] ||= new Set()).add(t.exportName);
    }
    const builtinImports = Object.entries(moduleGroups)
        .map(
            ([mod, names]) =>
                `import { ${Array.from(names).join(', ')} } from '${mod}';`,
        )
        .join('\n');

    const dynamicAssignments = Array.from(tagMap.keys())
        .map(
            (tagKey, idx) =>
                `globalThis.${tagKey} = element${idx}.tags.${tagKey};`,
        )
        .join('\n');

    const builtinAssignments = BUILTIN_TAGS.map(
        (t) => `globalThis.${t.name} = ${t.name};`,
    ).join('\n');

    return {
        imports: [dynamicImports, builtinImports].filter(Boolean).join('\n'),
        assignments: [dynamicAssignments, builtinAssignments]
            .filter(Boolean)
            .join('\n'),
    };
}

export async function setupEruditElements(
    nuxt: Nuxt,
    runtimeConfig: EruditRuntimeConfig,
) {
    const elementPaths = runtimeConfig.project.elements;
    for (const elementPath of elementPaths) {
        try {
            let elementImportPath = elementPath + '.global';
            if (elementImportPath.startsWith('./')) {
                elementImportPath = elementImportPath.replace(
                    './',
                    runtimeConfig.paths.project + '/',
                );
            }

            const globalElement: GlobalElementDefinition = (
                await import(elementImportPath)
            ).default;

            registerElementDependencies(nuxt, globalElement);
            registerElementTags(globalElement, elementImportPath);
            registeredElements++;
        } catch (error) {
            moduleLogger.warn(
                `Failed to register prose elements: ${elementPath}\n\n${error}`,
            );
        }
    }

    createGlobalTagTypes(runtimeConfig);
    createTagsTemplate(nuxt, runtimeConfig);

    moduleLogger.info(
        `Registered ${registeredElements} prose elements and ${registeredTags.size} tags${
            registeredTags.size
                ? ':\n' +
                  Array.from(registeredTags.keys())
                      .map((t) => `<${t}>`)
                      .join(' ')
                : '.'
        }`,
    );
}

function registerElementDependencies(
    nuxt: Nuxt,
    globalElement: GlobalElementDefinition,
) {
    if (!globalElement.dependencies) return;

    const nuxtTranspile = (nuxt.options.build.transpile ||= []);
    const optimizeDeps = (nuxt.options.vite.optimizeDeps ||= {});
    const optimizeDepsInclude = (optimizeDeps.include ||= []);

    for (const [dependency, options] of Object.entries(
        globalElement.dependencies,
    )) {
        if (options.transpile) nuxtTranspile.push(dependency);
        if (options.optimize) optimizeDepsInclude.push(dependency);
    }
}

function registerElementTags(
    globalElement: GlobalElementDefinition,
    elementImportPath: string,
) {
    if (!globalElement.tags) return;

    for (const tagKey of Object.keys(globalElement.tags)) {
        if (registeredTags.has(tagKey)) {
            moduleLogger.warn(
                `Tag <${tagKey}> is already registered in "${registeredTags.get(tagKey)}"!`,
            );
            continue;
        }
        registeredTags.set(tagKey, elementImportPath);
    }
}

function createGlobalTagTypes(runtimeConfig: EruditRuntimeConfig) {
    const content = generateGlobalTagTypes(registeredTags);
    writeFileSync(runtimeConfig.paths.build + '/types/tags.d.ts', content);
}

function createTagsTemplate(nuxt: Nuxt, runtimeConfig: EruditRuntimeConfig) {
    const templateBase = '#erudit/prose/tags';

    addTemplate({
        filename: templateBase + '.ts',
        write: true,
        getContents() {
            const { imports, assignments } =
                buildTagImportsAndAssignments(registeredTags);
            return `${imports}\n\n${assignments}\n\nexport {};`;
        },
    });

    const alias = (nuxt.options.alias ||= {});
    alias[templateBase] =
        runtimeConfig.paths.build + `/nuxt/.nuxt/${templateBase}.ts`;
}
