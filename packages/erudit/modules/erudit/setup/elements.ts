import { writeFileSync } from 'node:fs';
import { existsSync } from 'node:fs';
import type { Nuxt } from '@nuxt/schema';
import { addTemplate, resolvePath } from 'nuxt/kit';

import type { GlobalElementDefinition } from '@erudit-js/prose';
import { paragraphName } from '@erudit-js/prose/default/paragraph/index';
import { headingName } from '@erudit-js/prose/default/heading/index';
import { spanName } from '@erudit-js/prose/default/span/index';

import type { EruditRuntimeConfig } from '../../../shared/types/runtimeConfig';
import { moduleLogger } from '../logger';

type BuiltinElement = {
    appDefinition: string;
    tags?: Record<string, string>;
};

type BuiltinElements = Record<string, BuiltinElement>;

const BUILTIN_ELEMENTS: BuiltinElements = {
    [paragraphName]: {
        appDefinition: '@erudit-js/prose/default/paragraph/app',
        tags: { Paragraph: '@erudit-js/prose/default/paragraph/index' },
    },
    [headingName]: {
        appDefinition: '@erudit-js/prose/default/heading/app',
        tags: {
            H1: '@erudit-js/prose/default/heading/index',
            H2: '@erudit-js/prose/default/heading/index',
            H3: '@erudit-js/prose/default/heading/index',
        },
    },
    [spanName]: {
        appDefinition: '@erudit-js/prose/default/span/app',
        tags: { Span: '@erudit-js/prose/default/span/index' },
    },
};

const BUILTIN_TAGS = Object.values(BUILTIN_ELEMENTS).flatMap((element) =>
    Object.entries(element.tags ?? {}).map(([tagName, modulePath]) => ({
        name: tagName,
        module: modulePath,
        exportName: tagName,
    })),
);

const BUILTIN_APP_IMPORTS = Object.values(BUILTIN_ELEMENTS).map((el) => {
    const parts = el.appDefinition.split('/');
    return { name: parts[parts.length - 2]!, path: el.appDefinition };
});

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

            const importedName =
                (globalElement as any)?.name &&
                typeof (globalElement as any).name === 'string'
                    ? (globalElement as any).name
                    : undefined;

            if (importedName && importedName in BUILTIN_ELEMENTS) {
                throw new Error(
                    `Built-in element "${importedName}" cannot be overridden by "${elementPath}".`,
                );
            }

            registerElementDependencies(nuxt, globalElement);
            registerElementTags(globalElement, elementImportPath);
            registeredElements++;
        } catch (error) {
            if (
                error instanceof Error &&
                error.message.startsWith('Built-in element')
            ) {
                throw error;
            }
            moduleLogger.warn(
                `Failed to register prose elements: ${elementPath}\n\n${error}`,
            );
        }
    }

    createGlobalTagTypes(runtimeConfig);
    createTagsTemplate(nuxt, runtimeConfig);
    await createAppElementsTemplate(nuxt, runtimeConfig);
    await createGlobalElementsTemplate(nuxt, runtimeConfig);

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

async function createElementsTemplate(
    nuxt: Nuxt,
    runtimeConfig: EruditRuntimeConfig,
    options: {
        templateBase: string;
        variantSuffix: string;
        defaultImports: { name: string; path: string }[];
    },
) {
    const { templateBase, variantSuffix, defaultImports } = options;

    addTemplate({
        filename: templateBase + '.ts',
        write: true,
        async getContents() {
            let imports = defaultImports
                .map((i) => `import ${i.name} from '${i.path}';`)
                .join('\n');

            imports =
                options.variantSuffix === 'global'
                    ? "import type { GlobalElementDefinitions } from '@erudit-js/prose';\n" +
                      imports
                    : "import type { AppElementDefinitions } from '@erudit-js/prose/app';\n" +
                      imports;

            const elementVars = defaultImports.map((i) => i.name);

            if (runtimeConfig.project.elements?.length) {
                for (
                    let idx = 0;
                    idx < runtimeConfig.project.elements.length;
                    idx++
                ) {
                    let basePath = runtimeConfig.project.elements[idx];
                    let importPath = basePath + '.' + variantSuffix;
                    let resolvedPath = importPath;
                    if (importPath.startsWith('./')) {
                        resolvedPath = importPath.replace(
                            './',
                            runtimeConfig.paths.project + '/',
                        );
                    }
                    let absPath: string;
                    try {
                        absPath = await resolvePath(resolvedPath);
                    } catch {
                        absPath = '';
                    }
                    if (!absPath || !existsSync(absPath)) continue;
                    imports += `\nimport ${variantSuffix}_elements_${idx} from '${absPath}';`;
                    elementVars.push(`${variantSuffix}_elements_${idx}`);
                }
            }

            return `

${imports}

const elements: ${options.variantSuffix === 'global' ? 'GlobalElementDefinitions' : 'AppElementDefinitions'} = Object.fromEntries([
    ${elementVars.join(',\n    ')}
].map(e => [e.name, e]));

export default elements;`;
        },
    });

    const alias = (nuxt.options.alias ||= {});
    alias[templateBase] =
        runtimeConfig.paths.build + `/nuxt/.nuxt/${templateBase}.ts`;
}

async function createAppElementsTemplate(
    nuxt: Nuxt,
    runtimeConfig: EruditRuntimeConfig,
) {
    return createElementsTemplate(nuxt, runtimeConfig, {
        templateBase: '#erudit/prose/app-elements',
        variantSuffix: 'app',
        defaultImports: [...BUILTIN_APP_IMPORTS],
    });
}

async function createGlobalElementsTemplate(
    nuxt: Nuxt,
    runtimeConfig: EruditRuntimeConfig,
) {
    return createElementsTemplate(nuxt, runtimeConfig, {
        templateBase: '#erudit/prose/global-elements',
        variantSuffix: 'global',
        defaultImports: [],
    });
}
