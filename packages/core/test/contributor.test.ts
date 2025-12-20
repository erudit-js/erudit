import { describe, expect, it } from 'vitest';

import {
    contributorIdToPropertyName,
    globalContributorsObject,
    globalContributorsTypes,
} from '@erudit-js/core/contributor';

describe('Contributors Global', () => {
    describe('contributorIdToPropertyName', () => {
        it('should convert single word contributor id to camelCase', () => {
            expect(contributorIdToPropertyName('john')).toBe('john');
            expect(contributorIdToPropertyName('contributor')).toBe(
                'contributor',
            );
        });

        it('should convert hyphenated contributor id to camelCase', () => {
            expect(contributorIdToPropertyName('john-doe')).toBe('johnDoe');
            expect(contributorIdToPropertyName('test-contributor-name')).toBe(
                'testContributorName',
            );
            expect(contributorIdToPropertyName('foo-bar-baz')).toBe(
                'fooBarBaz',
            );
        });

        it('should handle multiple hyphens correctly', () => {
            expect(contributorIdToPropertyName('a-b-c-d')).toBe('aBCD');
        });
    });

    describe('globalContributorsObject', () => {
        it('should return empty object for empty array', () => {
            const result = globalContributorsObject([]);
            expect(result).toEqual({});
        });

        it('should create contributor object with contributor ids', () => {
            const result = globalContributorsObject([
                'contributorA',
                'contributorB',
                'test-contributor-c',
            ]);

            expect(result).toEqual({
                contributorA: 'contributorA',
                contributorB: 'contributorB',
                testContributorC: 'test-contributor-c',
            });
        });

        it('should throw error for duplicate export names', () => {
            expect(() => {
                globalContributorsObject(['foo-bar', 'fooBar']);
            }).toThrow(
                'Duplicate contributor export name detected: "fooBar" (from contributor ID: "fooBar")!',
            );
        });
    });

    describe('globalContributorsTypes', () => {
        it('should generate types declaration for empty object', () => {
            const result = globalContributorsTypes({});
            expect(result).toBe(
                `export {};

declare global {
    const $CONTRIBUTOR: {

    };
}
`,
            );
        });

        it('should generate types declaration with contributors', () => {
            const result = globalContributorsTypes({
                contributorA: 'contributorA',
                testContributorB: 'test-contributor-b',
            });

            expect(result).toBe(
                `export {};

declare global {
    const $CONTRIBUTOR: {
        contributorA: "contributorA";
        testContributorB: "test-contributor-b";
    };
}
`,
            );
        });

        it('should handle multiple contributors correctly', () => {
            const result = globalContributorsTypes({
                john: 'john',
                janeDoe: 'jane-doe',
                bobSmith: 'bob-smith',
            });

            expect(result).toContain('john: "john";');
            expect(result).toContain('janeDoe: "jane-doe";');
            expect(result).toContain('bobSmith: "bob-smith";');
        });
    });
});
