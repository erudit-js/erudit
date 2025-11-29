import { describe, expect, it } from 'vitest';

import {
    insertItemId,
    parseContentItemId,
    stringifyContentItemId,
} from '@erudit-js/core/content/itemId';

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

describe('insertItemId', () => {
    it('should insert item IDs into define calls without config object', () => {
        const code = `
            const page = definePage();
        `;
        const result = insertItemId(code, 'page/some-id');
        expect(result).toContain(`definePage({ itemId: 'page/some-id' })`);
    });

    it('should insert item IDs into define calls with existing config object', () => {
        const code = `
            const topic = defineTopic({ title: 'My Topic' });
            const page = definePage({
                title: 'My Page',
            });
        `;
        const result = insertItemId(code, 'topic/another-id');
        expect(result).toContain(
            `defineTopic({ itemId: 'topic/another-id', title: 'My Topic' })`,
        );
        expect(result).toContain(
            `definePage({ itemId: 'topic/another-id',\n                title: 'My Page',`,
        );
    });
});
