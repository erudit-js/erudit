import { describe, expect, it } from 'vitest';

import {
    insertContentId,
    parseContentItemId,
    pathToContentId,
    stringifyContentItemId,
} from '@erudit-js/core/content/itemId';
import { injectIdPropertyName } from '@erudit-js/core/content/item';

describe('Stringify and parse item IDs', () => {
    it('should return undefined when parsing invalid content type', () => {
        const result = parseContentItemId('invalidType/some-id');
        expect(result).toBeUndefined();
    });

    it('should correctly parse valid content item IDs', () => {
        const result = parseContentItemId('page/some/content-id');
        expect(result).toEqual({
            type: 'page',
            contentId: 'some/content-id',
        });
        expect(stringifyContentItemId(result!)).toBe('page/some/content-id');
    });
});

describe('insertContentId', () => {
    it('should insert item IDs into define calls without config object', () => {
        const code = `
            const page = definePage();
        `;
        const result = insertContentId(code, 'some-id');
        expect(result).toContain(
            `definePage({ ${injectIdPropertyName}: 'some-id' })`,
        );
    });

    it('should insert item IDs into define calls with existing config object', () => {
        const code = `
            const topic = defineTopic({ title: 'My Topic' });
            const page = definePage({
                title: 'My Page',
            });
        `;
        const result = insertContentId(code, 'another-id');
        expect(result).toContain(
            `defineTopic({ ${injectIdPropertyName}: 'another-id', title: 'My Topic' })`,
        );
        expect(result).toContain(
            `definePage({ ${injectIdPropertyName}: 'another-id',\n                title: 'My Page',`,
        );
    });
});

describe('pathToContentId', () => {
    it('should return undefined when the path does not match any content item', () => {
        expect(
            pathToContentId('/some/other/path', '/project/path'),
        ).toBeUndefined();
    });

    it('should correctly parse valid content item paths', () => {
        expect(
            pathToContentId(
                '/project/path/content/1-some/page.tsx',
                '/project/path',
            ),
        ).toEqual('some');
        expect(
            pathToContentId(
                '/project/path/content/2-some/group.ts',
                '/project/path',
            ),
        ).toEqual('some');
        expect(
            pathToContentId(
                '/project/path/content/3+some/topic.tsx',
                '/project/path',
            ),
        ).toEqual('some');
        expect(
            pathToContentId(
                '/project/path/content/4+some/book.ts',
                '/project/path',
            ),
        ).toEqual('some');
    });
});
