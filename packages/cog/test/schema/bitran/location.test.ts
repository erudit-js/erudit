import {
    decodeBitranLocation,
    encodeBitranLocation,
    parseBitranLocation,
    parsePartialBitranLocation,
    stringifyBitranLocation,
    type BitranLocation,
} from '../../../src/schema/bitran/location';
import { isContentType } from '../../../src/schema/content/base';

const locations: [BitranLocation, string][] = [
    // Full locations
    [{ type: 'article', path: 'foo', unique: 'bar' }, 'article|foo|bar'],
    [{ type: 'group', path: 'foo', unique: 'bar' }, 'group|foo|bar'],
    // Type + path
    [{ type: 'article', path: 'foo' }, 'article|foo'],
    [{ type: 'group', path: 'foo' }, 'group|foo'],
];

const partialLocations: [string, BitranLocation, BitranLocation][] = [
    // Full string location
    [
        'article|foo/bar|baz',
        { type: 'group', path: 'qux' },
        { type: 'article', path: 'foo/bar', unique: 'baz' },
    ],
    // Only unique - should be absolute path only for content types
    [
        'baz',
        { type: 'summary', path: 'foo/bar' },
        {
            type: 'summary',
            path: '/foo/bar',
            unique: 'baz',
        },
    ],
    [
        'baz',
        { type: 'contributor', path: 'John' },
        {
            type: 'contributor',
            path: 'John',
            unique: 'baz',
        },
    ],
    // Topic context - should be absolute path only for content types
    [
        'article|baz',
        { type: 'practice', path: 'foo/bar' },
        {
            type: 'article',
            path: '/foo/bar',
            unique: 'baz',
        },
    ],
    // Test with already absolute path in context - should remain the same
    [
        'baz',
        { type: 'summary', path: '/foo/bar' },
        { type: 'summary', path: '/foo/bar', unique: 'baz' },
    ],
    // Test with context location without path
    [
        'baz',
        { type: 'summary' },
        { type: 'summary', path: undefined, unique: 'baz' },
    ],
];

const invalidPartialLocations: [string, BitranLocation][] = [
    // Referencing topic part in non-topic context
    ['article|bar', { type: 'contributor', path: 'foo' }],
];

const invalidLocations = [
    // Too few parts
    { type: 'article' },
    { path: 'foo' },
    { unique: 'foo' },
    // Unknown type
    { type: 'foo' },
    { type: 'foo', path: 'bar', unique: 'baz' },
    // Locations that require path
    { type: 'article', unique: 'foo' },
    { type: 'summary', unique: 'foo' },
    { type: 'practice', unique: 'foo' },
    { type: 'group', unique: 'foo' },
    { type: 'contributor', unique: 'foo' },
];

const invalidStrLocations = [
    // Too few parts
    'article',
    'group',
    // Unknown type
    'foo',
    'foo|bar',
    'foo|bar|baz',
    // Empty string unique
    'article|foo/bar|',
];

//
//
//

describe('stringifyBitranLocation', () => {
    for (const [location, expected] of locations) {
        it(`should produce "${expected}"`, () => {
            expect(stringifyBitranLocation(location)).toBe(expected);
        });
    }

    for (const invalidLocation of invalidLocations) {
        it(`should throw on location ${JSON.stringify(invalidLocation)}`, () => {
            expect(() =>
                stringifyBitranLocation(invalidLocation as BitranLocation),
            ).toThrow();
        });
    }

    it('should normalize trailing slash in path', () => {
        expect(
            stringifyBitranLocation({
                type: 'article',
                path: 'foo/',
                unique: 'bar',
            }),
        ).toBe('article|foo|bar');
    });

    it('should keep root path as "/"', () => {
        expect(
            stringifyBitranLocation({
                type: 'article',
                path: '/',
                unique: 'bar',
            }),
        ).toBe('article|/|bar');
    });

    it('should normalize trailing slash in path without unique', () => {
        expect(stringifyBitranLocation({ type: 'article', path: 'foo/' })).toBe(
            'article|foo',
        );
    });

    it('should keep root path as "/" without unique', () => {
        expect(stringifyBitranLocation({ type: 'article', path: '/' })).toBe(
            'article|/',
        );
    });
});

describe('parseBitranLocation', () => {
    for (const [location, expected] of locations) {
        it(`should produce ${JSON.stringify(expected)}`, () => {
            expect(parseBitranLocation(expected)).toEqual(location);
        });
    }

    for (const invalidStrLocation of invalidStrLocations) {
        it(`should throw on location "${invalidStrLocation}"`, () => {
            expect(() => parseBitranLocation(invalidStrLocation)).toThrow();
        });
    }
});

describe('parsePartialBitranLocation', () => {
    for (const [locationStr, context, expected] of partialLocations) {
        it(`should produce ${JSON.stringify(expected)}`, () => {
            expect(parsePartialBitranLocation(locationStr, context)).toEqual(
                expected,
            );
        });
    }

    for (const [locationStr, context] of invalidPartialLocations) {
        it(`should throw on location "${locationStr}"`, () => {
            expect(() =>
                parsePartialBitranLocation(locationStr, context),
            ).toThrow();
        });
    }
});

describe('decode/encodeBitranLocation', () => {
    it.each([
        '',
        'foo',
        'foo|bar',
        'foo|bar|baz',
        'foo|bar/baz|qux',
        'foo|bar/baz/qux|corge:grault:waldo',
    ])('should not change string location %p', (testCase) =>
        expect(decodeBitranLocation(encodeBitranLocation(testCase))).toBe(
            testCase,
        ),
    );
});
