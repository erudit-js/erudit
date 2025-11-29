import { injectIdPropertyName } from './item.js';
import { contentPathToId } from './path.js';
import { isContentType, type ContentType } from './type.js';

export interface ContentItemId {
    type: ContentType;
    contentId: string;
}

export function stringifyContentItemId(itemId: ContentItemId): string {
    return `${itemId.type}/${itemId.contentId}`;
}

export function parseContentItemId(str: string): ContentItemId | undefined {
    const [type, ...contentId] = str.split('/');

    if (!isContentType(type)) {
        return undefined;
    }

    return {
        type,
        contentId: contentId.join('/'),
    };
}

export function pathToContentId(
    path: string,
    projectPath: string,
): string | undefined {
    if (path.startsWith(`${projectPath}/content/`)) {
        const fullContentId = contentPathToId(path, projectPath, 'full');
        if (fullContentId) {
            const lastPart = path.split('/').pop();
            switch (lastPart) {
                case 'page.tsx':
                case 'group.ts':
                case 'group.tsx':
                case 'topic.ts':
                case 'topic.tsx':
                case 'book.ts':
                case 'book.tsx':
                    return fullContentId;
            }
        }
    }
}

export function insertContentId(code: string, contentId: string) {
    // Match definePage, defineBook, defineGroup, or defineTopic calls
    const definePattern =
        / (definePage|defineBook|defineGroup|defineTopic)\s*\(\s*/g;

    let result = code;
    let match;
    let offset = 0;

    // Reset lastIndex for global regex
    definePattern.lastIndex = 0;

    while ((match = definePattern.exec(code)) !== null) {
        const matchEnd = match.index + match[0].length;

        // Find the opening brace or check if there's no argument
        let braceIndex = matchEnd;
        let foundBrace = false;

        // Skip whitespace to find { or )
        while (braceIndex < code.length) {
            const char = code[braceIndex];

            if (char === '{') {
                foundBrace = true;
                break;
            } else if (char === ')') {
                // No config object, need to add one
                break;
            } else if (!/\s/.test(char)) {
                // Non-whitespace that's not { or ), invalid syntax
                break;
            }

            braceIndex++;
        }

        if (foundBrace) {
            // Insert after the opening brace
            const insertPos = braceIndex + 1 + offset;
            const insertion = ` ${injectIdPropertyName}: '${contentId}',`;
            result =
                result.slice(0, insertPos) +
                insertion +
                result.slice(insertPos);
            offset += insertion.length;
        } else {
            // No brace found, insert { itemId: 'itemId' }
            const insertPos = matchEnd + offset;
            const insertion = `{ ${injectIdPropertyName}: '${contentId}' }`;
            result =
                result.slice(0, insertPos) +
                insertion +
                result.slice(insertPos);
            offset += insertion.length;
        }
    }

    return result;
}
