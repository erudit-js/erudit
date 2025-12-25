import { readFileSync, writeFileSync } from 'node:fs';
import { topicParts, type TopicPart } from '@erudit-js/core/content/topic';

// Trigger globalThis update
$LINK;

export async function buildLink() {
    ERUDIT.log.debug.start('Building global link...');

    const linkObject = await buildLinkObject();

    const linkTypes = linkObjectToTypes(linkObject);
    writeFileSync(
        ERUDIT.config.paths.build + '/types/link.d.ts',
        linkTypes,
        'utf-8',
    );

    ERUDIT.log.success('Global link built successfully!');
}

function linkObjectToTypes(linkObject: any): string {
    const indent = (level: number) => '    '.repeat(level);

    function toCamelCase(str: string): string {
        return str.replace(/[-_](.)/g, (_, char) => char.toUpperCase());
    }

    function processObject(obj: any, level: number): string {
        const lines: string[] = [];

        for (const [key, value] of Object.entries(obj) as [string, any][]) {
            if (key === '__jsdoc') continue;

            const camelKey = toCamelCase(key);

            // Add JSDoc comment if present
            if (value && typeof value === 'object' && value.__jsdoc) {
                const jsdocLines = value.__jsdoc.split('\n');
                jsdocLines.forEach((line: string) => {
                    lines.push(indent(level) + line);
                });
            }

            // Determine if value has nested properties (excluding __jsdoc)
            const hasNestedProps =
                value &&
                typeof value === 'object' &&
                Object.keys(value).some((k) => k !== '__jsdoc');

            if (hasNestedProps) {
                lines.push(
                    indent(level) + `${camelKey}: GlobalLinkTypeguard & {`,
                );
                lines.push(processObject(value, level + 1));
                lines.push(indent(level) + `}`);
            } else {
                lines.push(
                    indent(level) + `${camelKey}: GlobalLinkTypeguard & {}`,
                );
            }
        }

        return lines.join('\n');
    }

    const body = processObject(linkObject, 2);

    return `import { GlobalLinkTypeguard } from '@erudit-js/core/prose/link';

export {};

declare global {
    const $LINK: {
${body}
    }
}`;
}

/**
 * Loop through the content navigation tree and build a nested object representing the link structure:
 */
async function buildLinkObject() {
    const linkTree: any = {};

    await ERUDIT.contentNav.walk((navItem) => {
        // Navigate to the correct position in the tree based on the full path
        let cursor = linkTree;
        const pathParts = navItem.fullId.split('/');

        // Navigate through parent parts
        for (let i = 0; i < pathParts.length - 1; i++) {
            cursor = cursor[pathParts[i]];
        }

        //
        //
        //

        if (navItem.type === 'page') {
            const pathToFile = `${ERUDIT.config.paths.project}/content/${navItem.contentRelPath}/${navItem.type}.tsx`;
            const moduleContent = readFileSync(pathToFile, 'utf-8');
            const title = tryGetTitle(moduleContent);

            const jsdoc = jsdocLines([
                title ? `Title: ${title}` : undefined,
                `Type: ${navItem.type}`,
                `Location: [${navItem.contentRelPath}](file:///${pathToFile})`,
            ]);

            cursor[navItem.idPart] = {
                __jsdoc: `
/**
${jsdoc}
 */
                `.trim(),
                ...tryGetUniquesObject(
                    moduleContent,
                    pathToFile,
                    navItem.contentRelPath,
                ),
            };
        } else if (navItem.type === 'topic') {
            const pathToTopicFile = `${ERUDIT.config.paths.project}/content/${navItem.contentRelPath}/topic.ts`;
            const topicModuleContent = readFileSync(pathToTopicFile, 'utf-8');
            const title = tryGetTitle(topicModuleContent);

            const jsdoc = jsdocLines([
                title ? `Title: ${title}` : undefined,
                `Type: topic`,
                `Location: [${navItem.contentRelPath}](file:///${pathToTopicFile})`,
            ]);

            cursor[navItem.idPart] = {
                __jsdoc: `
/**
${jsdoc}
 */
                `.trim(),
            };

            for (const part of topicParts) {
                try {
                    const pathToFile = `${ERUDIT.config.paths.project}/content/${navItem.contentRelPath}/${part}.tsx`;
                    const partContent = readFileSync(pathToFile, 'utf-8');

                    const jsdoc = jsdocLines([
                        title ? `Title: ${title}` : undefined,
                        `Type: topic`,
                        `Part: ${part}`,
                        `Location: [${navItem.contentRelPath}](file:///${pathToFile})`,
                    ]);

                    cursor[navItem.idPart][part as TopicPart] = {
                        __jsdoc: `
/**
${jsdoc}
 */
                        `.trim(),
                        ...tryGetUniquesObject(
                            partContent,
                            pathToFile,
                            navItem.contentRelPath,
                        ),
                    };
                } catch {}
            }
        } else {
            const pathToFile = `${ERUDIT.config.paths.project}/content/${navItem.contentRelPath}/${navItem.type}.ts`;
            const moduleContent = readFileSync(pathToFile, 'utf-8');
            const title = tryGetTitle(moduleContent);

            const jsdoc = jsdocLines([
                title ? `Title: ${title}` : undefined,
                `Type: ${navItem.type}`,
                `Location: [${navItem.contentRelPath}](file:///${pathToFile})`,
            ]);

            cursor[navItem.idPart] = {
                __jsdoc: `
/**
${jsdoc}
 */
                `.trim(),
            };
        }
    });

    return linkTree;
}

function tryGetTitle(moduleContent: string) {
    const titleMatch = moduleContent.match(/title:\s*['"`](.*?)['"`]/);

    if (titleMatch) {
        return titleMatch[1].trim();
    }
}

function jsdocLines(lines: any[]) {
    return lines
        .filter(Boolean)
        .map((line) => ` * * ${line}`)
        .join('\n');
}

function tryGetUniquesObject(
    moduleContent: string,
    pathToFile: string,
    pathInContent: string,
) {
    // Match uniques: { ... } object (single or multiline)
    const uniquesMatch = moduleContent.match(/uniques:\s*\{([^}]*)\}/s);

    if (!uniquesMatch) {
        return {};
    }

    const uniquesContent = uniquesMatch[1];

    // Parse key-value pairs from uniques object
    const lines = uniquesContent.split('\n');
    const result: any = {};

    for (const line of lines) {
        // Skip commented out lines
        if (line.trim().startsWith('//')) {
            continue;
        }

        // Skip uniques starting with underscore
        if (line.trim().startsWith('_')) {
            continue;
        }

        const pairMatch = line.match(/(\w+):\s*(\w+)/);
        if (!pairMatch) {
            continue;
        }

        const [, uniqueName, tagName] = pairMatch;

        const jsdoc = jsdocLines([
            'Unique',
            `Tag: \`<${tagName}>\``,
            `Location: [${pathInContent}](file:///${pathToFile})`,
        ]);

        result[`$${uniqueName}`] = {
            __jsdoc: `
/**
${jsdoc}
 */
            `.trim(),
        };
    }

    return result;
}
