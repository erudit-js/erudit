import {
    NO_ALIASES,
    stringifyBitranLocation,
    type BitranContext,
} from '@erudit-js/cog/schema';

import {
    createLinkTarget,
    type AbsoluteLinkTarget,
    type ExternalLinkTarget,
    type LinkTargetType,
    type PageLinkTarget,
    type UniqueLinkTarget,
} from '../../../src/elements/link/target';

const articleContext: BitranContext = {
    location: {
        type: 'article',
        path: 'a/b/c',
    },
    aliases: {
        a1: 'alias1',
    },
};

const contributorContext: BitranContext = {
    location: {
        type: 'contributor',
        path: 'john',
    },
    aliases: NO_ALIASES(),
};

//
//
//

const absoluteTargets = ['/', '/foo/bar/baz'];

const externalTargets = [
    'http://www.google.com',
    'http://www.google.com/',
    'https://www.google.com/foo/bar/baz',
    'https://www.google.com/foo/bar/baz?a=1&b=2#anchor',
];

const validPageTargets: [string, Pick<PageLinkTarget, 'pageType' | 'path'>][] =
    [
        // With "page|" prefix
        ['page|contributor|john', { pageType: 'contributor', path: 'john' }],
        ['page|article|foo/bar', { pageType: 'article', path: 'foo/bar' }],
        [
            'page|book|combinatorics',
            { pageType: 'book', path: 'combinatorics' },
        ],
        [
            'page|summary',
            { pageType: 'summary', path: '/' + articleContext.location.path },
        ],
        // Without "page|" prefix for non-topic parts
        ['contributor|john', { pageType: 'contributor', path: 'john' }],
    ];

const invalidPageTargets = [
    // Reference topic part in non-topic context
    'page|article',
    // Unknown page type
    'page|foo|a/b/c',
    // Unkown Bitran location type
    'book|combinatorics',
];

const validUniqueTargets: [string, string][] = [
    ['definition', 'article|/a/b/c|definition'],
    ['practice|term', 'practice|/a/b/c|term'],
    ['contributor|john|theorem', 'contributor|john|theorem'],
];

//
//
//

describe('createLinkTarget', () => {
    it.each(absoluteTargets)(
        'should create absolute link target for %p',
        (absoluteTarget) => {
            const target = createLinkTarget(
                absoluteTarget,
                articleContext,
            ) as AbsoluteLinkTarget;

            expect(target.type).toBe<LinkTargetType>('absolute');
            expect(target.href).toBe(absoluteTarget);
        },
    );

    it.each(externalTargets)(
        'should create external link target for %p',
        (externalTarget) => {
            const target = createLinkTarget(
                externalTarget,
                articleContext,
            ) as ExternalLinkTarget;

            expect(target.type).toBe<LinkTargetType>('external');
            expect(target.href).toBe(externalTarget);
        },
    );

    for (const [pageTarget, expected] of validPageTargets) {
        it(`should create page link target for "${pageTarget}"`, () => {
            const target = createLinkTarget(
                pageTarget,
                articleContext,
            ) as PageLinkTarget;

            expect(target.type).toBe<LinkTargetType>('page');
            expect(target.pageType).toBe(expected.pageType);
            expect(target.path).toBe(expected.path);
        });
    }

    for (const invalidPageTarget of invalidPageTargets) {
        it(`should throw on page link target "${invalidPageTarget}"`, () => {
            expect(() =>
                createLinkTarget(invalidPageTarget, contributorContext),
            ).toThrow();
        });
    }

    for (const [uniqueTarget, expected] of validUniqueTargets) {
        it(`should create unique link target for "${uniqueTarget}"`, () => {
            const target = createLinkTarget(
                uniqueTarget,
                articleContext,
            ) as UniqueLinkTarget;

            expect(target.type).toBe<LinkTargetType>('unique');
            expect(stringifyBitranLocation(target.location)).toBe(expected);
        });
    }
});
