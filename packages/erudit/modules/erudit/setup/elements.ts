import { readFileSync, writeFileSync } from 'node:fs';
import chalk from 'chalk';
import type { Nuxt } from 'nuxt/schema';
import { addTemplate, findPath } from 'nuxt/kit';
import type { AnyRegistryItem } from '@jsprose/core';
import { extractTagDocs, type EruditProseCoreElement } from '@erudit-js/prose';

import type { EruditRuntimeConfig } from '../../../shared/types/runtimeConfig';
import { moduleLogger } from '../logger';

const BUILTIN_ELEMENT_PATHS = [
    '@erudit-js/prose/elements/callout',
    '@erudit-js/prose/elements/caption',
    '@erudit-js/prose/elements/details',
    '@erudit-js/prose/elements/emphasis',
    '@erudit-js/prose/elements/flex',
    '@erudit-js/prose/elements/gallery',
    '@erudit-js/prose/elements/heading',
    '@erudit-js/prose/elements/horizontalLine',
    '@erudit-js/prose/elements/image',
    '@erudit-js/prose/elements/lineBreak',
    '@erudit-js/prose/elements/link',
    '@erudit-js/prose/elements/list',
    '@erudit-js/prose/elements/paragraph',
    '@erudit-js/prose/elements/problem',
    '@erudit-js/prose/elements/table',
    '@erudit-js/prose/elements/video',
];

type SetupTag = {
    tagName: string;
    docs: string | undefined;
    typeofImport: string;
};

function formatTagsTable(tagNames: string[], columns = 4) {
    if (tagNames.length === 0) return '';
    const cols = Math.max(1, columns);
    const formatted = tagNames.map((t) => `<${t}>`);
    const maxLen = Math.max(...formatted.map((s) => s.length));
    const colWidth = maxLen + 2; // padding between columns

    const rows = Math.ceil(formatted.length / cols);
    const lines: string[] = [];

    for (let r = 0; r < rows; r++) {
        const start = r * cols;
        const rowItems = formatted.slice(start, start + cols);
        const padded = rowItems.map((s) => s.padEnd(colWidth, ' '));
        lines.push(padded.join('').replace(/\s+$/u, '')); // trim trailing spaces on the row
    }

    return lines.join('\n');
}

export async function setupProseElements(
    nuxt: Nuxt,
    runtimeConfig: EruditRuntimeConfig,
) {
    const corePath2Abs = new Map<string, string>();
    const appPath2Abs = new Map<string, string>();

    const tags: Map<string, SetupTag> = new Map();
    const registryItems: Map<string, AnyRegistryItem> = new Map();

    const elementPaths: string[] = [
        ...BUILTIN_ELEMENT_PATHS,
        ...runtimeConfig.project.elements,
    ];

    for (const elementPath of elementPaths) {
        //
        // Core element
        //

        const corePath = elementPath + '/core';
        const coreAbsPath = await findPath(corePath, {
            cwd: runtimeConfig.paths.project,
            extensions: ['.ts', '.js'],
        });

        if (!coreAbsPath) {
            throw new Error(
                `Failed to detect "core" part of prose element "${elementPath}"!`,
            );
        }

        corePath2Abs.set(corePath, coreAbsPath);

        const docsContent = await getDocsContent(elementPath, runtimeConfig);

        const coreDefault: EruditProseCoreElement | EruditProseCoreElement[] = (
            await import(coreAbsPath)
        ).default;

        if (Array.isArray(coreDefault)) {
            for (const [index, coreElement] of coreDefault.entries()) {
                handleCoreElement(
                    nuxt,
                    coreAbsPath,
                    coreElement,
                    index,
                    tags,
                    registryItems,
                    docsContent,
                );
            }
        } else {
            const coreElement = coreDefault;
            handleCoreElement(
                nuxt,
                coreAbsPath,
                coreElement,
                undefined,
                tags,
                registryItems,
                docsContent,
            );
        }

        //
        // App element
        //

        const appPath = elementPath + '/app';
        const appAbsPath = await findPath(appPath, {
            cwd: runtimeConfig.paths.project,
            extensions: ['.ts', '.js'],
        });

        if (appAbsPath) {
            appPath2Abs.set(appPath, appAbsPath);
        }
    }

    setupGlobalTagTypes(runtimeConfig, tags);
    setupCoreProseTemplate(nuxt, Array.from(corePath2Abs.values()));
    setupAppProseTemplate(nuxt, Array.from(appPath2Abs.values()));

    const tagTable = formatTagsTable(Array.from(tags.keys()).sort(), 4);

    moduleLogger.success(
        `
Registered ${registryItems.size} prose element schema(s) and ${tags.size} tag(s):
${chalk.gray(tagTable)}
        `.trim(),
    );
}

function setupAppProseTemplate(nuxt: Nuxt, absolutePaths: string[]) {
    const defautImportName = (i: number) => `app_element_${i}`;
    const defaultImportNames = absolutePaths.map((_, i) => defautImportName(i));
    const noExtPaths = absolutePaths.map((p) => p.replace(/\.(?:js|ts)$/, ''));

    const template = `
import type { AppElement } from '@erudit-js/prose/app';

${defaultImportNames
    .map((importName, i) => `import ${importName} from '${noExtPaths[i]}';`)
    .join('\n')}

const appElements: AppElement[] = [
    ${defaultImportNames.join(',\n    ')}
].flatMap(e => (Array.isArray(e) ? e : [e]) as any);

export default Object.fromEntries(
    appElements.map(e => [e.schema.name, e])
);
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
        nuxt.options.buildDir + `/#erudit/prose/app.ts`;
}

function setupCoreProseTemplate(nuxt: Nuxt, absolutePaths: string[]) {
    const defautImportName = (i: number) => `core_element_${i}`;
    const defaultImportNames = absolutePaths.map((_, i) => defautImportName(i));
    const noExtPaths = absolutePaths.map((p) => p.replace(/\.(?:js|ts)$/, ''));

    const template = `
import { PROSE_REGISTRY } from '@jsprose/core';
import { jsx, jsxs, Fragment } from '@jsprose/core/jsx-runtime';
import type { EruditProseCoreElement } from '@erudit-js/prose';
import { defineProblemScript } from '@erudit-js/prose/elements/problem/problemScript';

${defaultImportNames
    .map((importName, i) => `import ${importName} from '${noExtPaths[i]}';`)
    .join('\n')}

const coreElements: EruditProseCoreElement[] = [
    ${defaultImportNames.join(',\n    ')}
].flatMap(e => (Array.isArray(e) ? e : [e]) as any);

// Register prose tags in registry and make them globally available without import
for (const element of coreElements) {
    PROSE_REGISTRY.addItem(element.registryItem);
    Object.assign(globalThis, element.registryItem.tags || {});
}

Object.assign(globalThis, {
    // Make jsx runtime globally available (for prose generation in isolated modules like problem scripts)
    jsx,
    jsxs,
    Fragment,
    // Problem globals
    defineProblemScript,
});

export {};
    `.trim();

    addTemplate({
        write: true,
        filename: '#erudit/prose/core.ts',
        getContents() {
            return template;
        },
    });

    const alias = (nuxt.options.alias ||= {});
    alias['#erudit/prose/core'] =
        nuxt.options.buildDir + `/#erudit/prose/core.ts`;
}

function setupElementDependenices(
    nuxt: Nuxt,
    coreElement: EruditProseCoreElement,
) {
    const transpile = (nuxt.options.build.transpile ||= []);
    const optimizeDeps = nuxt.options.vite.optimizeDeps || {};
    const optimizeDepsInclude = (optimizeDeps.include ||= []);

    for (const [name, options] of Object.entries(
        coreElement.dependencies ?? {},
    )) {
        if (options?.transpile) transpile.push(name);
        if (options?.optimize) optimizeDepsInclude.push(name);
    }
}

function setupGlobalTagTypes(
    runtimeConfig: EruditRuntimeConfig,
    tags: Map<string, SetupTag>,
) {
    const indent = (text: string) =>
        text
            .split('\n')
            .map((line) => '    ' + line)
            .join('\n');

    const dtsCode = `
declare global {
${Array.from(tags.values())
    .map(
        (tag) =>
            `${indent(tag.docs ?? '')}\n    const ${tag.tagName}: ${tag.typeofImport};`,
    )
    .join('\n')}
}

export {};
    `.trim();

    writeFileSync(runtimeConfig.paths.build + '/types/tags.d.ts', dtsCode);
}

function handleCoreElement(
    nuxt: Nuxt,
    absPath: string,
    coreElement: EruditProseCoreElement,
    index: number | undefined,
    tags: Map<string, SetupTag>,
    registryItems: Map<string, AnyRegistryItem>,
    docsContent: string | undefined,
) {
    const schemaName = coreElement.registryItem.schema.name;

    if (registryItems.has(schemaName)) {
        throw new Error(
            `Prose element schema name "${schemaName}" is already registered by another element!`,
        );
    }

    registryItems.set(schemaName, coreElement.registryItem);

    if (coreElement.registryItem.tags) {
        for (const tagName of Object.keys(coreElement.registryItem.tags)) {
            if (tags.has(tagName)) {
                throw new Error(
                    `Prose element tag name "<${tagName}>" is already registered by another element!`,
                );
            }

            tags.set(tagName, {
                tagName,
                docs: extractTagDocs(tagName, docsContent || ''),
                typeofImport: `typeof import('${absPath}')${index !== undefined ? `['default'][${index}]` : "['default']"}['registryItem']['tags']['${tagName}']`,
            });
        }
    }

    setupElementDependenices(nuxt, coreElement);
}

async function getDocsContent(
    elementPath: string,
    runtimeConfig: EruditRuntimeConfig,
): Promise<string | undefined> {
    const docsAbsPath = await findPath(elementPath + '/docs', {
        cwd: runtimeConfig.paths.project,
        extensions: ['.ts', '.js'],
    });

    if (docsAbsPath) {
        return readFileSync(docsAbsPath, 'utf-8');
    }
}
