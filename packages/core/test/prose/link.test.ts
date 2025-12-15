import { describe, expect, it } from 'vitest';

import {
    parseProseLink,
    stringifyProseLink,
    type ContentItemProseLink,
    type DirectProseLink,
    type DocumentProseLink,
    type UniqueProseLink,
} from '@erudit-js/core/prose/link';

describe('Stringify and parse prose link', () => {
    it('should return undefined when parsing invalid prose link', () => {
        expect(parseProseLink('invalidLinkType/someValue')).toBeUndefined();
    });

    it('should stringify and parse direct prose link', () => {
        const originalLink: DirectProseLink = {
            type: 'direct',
            href: 'https://example.com',
        };
        const strLink = 'direct/https://example.com';
        expect(parseProseLink(strLink)).toEqual(originalLink);
        expect(strLink).toEqual(stringifyProseLink(originalLink));
    });

    it('should stringify and parse document prose link', () => {
        const originalLink: DocumentProseLink = {
            type: 'document',
            documentId: {
                type: 'contentTopic',
                topicPart: 'practice',
                contentId: 'foo/bar',
            },
        };
        const strLink = 'document/contentTopic/practice/foo/bar';
        expect(parseProseLink(strLink)).toEqual(originalLink);
        expect(strLink).toEqual(stringifyProseLink(originalLink));
    });

    it('should stringify and parse unique prose link', () => {
        const originalLink: UniqueProseLink = {
            type: 'unique',
            documentId: {
                type: 'contentPage',
                contentId: 'baz/qux',
            },
            uniqueName: 'unique-element-123',
        };
        const strLink = 'unique/contentPage/baz/qux/unique-element-123';
        expect(parseProseLink(strLink)).toEqual(originalLink);
        expect(strLink).toEqual(stringifyProseLink(originalLink));
    });

    it('should stringify and parse content item prose link', () => {
        const originalLink: ContentItemProseLink = {
            type: 'contentItem',
            itemId: {
                type: 'book',
                contentId: 'my-book/combinatorics',
            },
        };
        const strLink = 'contentItem/book/my-book/combinatorics';
        expect(parseProseLink(strLink)).toEqual(originalLink);
        expect(strLink).toEqual(stringifyProseLink(originalLink));
    });
});
