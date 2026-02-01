import { describe, expect, it } from 'vitest';

import { normalizeUrlProps } from '@src/shared/urlProps.js';

describe('normalizeUrlProps', () => {
    describe('default behavior', () => {
        it('should return default localhost URL when no arguments provided', () => {
            const result = normalizeUrlProps({
                siteUrl: 'http://localhost:3000',
                basePath: '/',
            });
            expect(result).toEqual({
                siteUrl: 'http://localhost:3000/',
                basePath: '/',
            });
        });
    });

    describe('site URL normalization', () => {
        it('should normalize http URL', () => {
            const result = normalizeUrlProps({
                siteUrl: 'http://example.com',
                basePath: '/',
            });
            expect(result.siteUrl).toBe('http://example.com/');
        });

        it('should normalize https URL', () => {
            const result = normalizeUrlProps({
                siteUrl: 'https://example.com',
                basePath: '/',
            });
            expect(result.siteUrl).toBe('https://example.com/');
        });

        it('should preserve port number', () => {
            const result = normalizeUrlProps({
                siteUrl: 'http://localhost:8080',
                basePath: '/',
            });
            expect(result.siteUrl).toBe('http://localhost:8080/');
        });

        it('should remove trailing slash from host', () => {
            const result = normalizeUrlProps({
                siteUrl: 'http://example.com/',
                basePath: '/',
            });
            expect(result.siteUrl).toBe('http://example.com/');
        });

        it('should extract base path from URL pathname', () => {
            const result = normalizeUrlProps({
                siteUrl: 'http://example.com/app',
                basePath: '/',
            });
            expect(result).toEqual({
                siteUrl: 'http://example.com/app/',
                basePath: '/app/',
            });
        });

        it('should normalize base path from URL with multiple segments', () => {
            const result = normalizeUrlProps({
                siteUrl: 'http://example.com/my/app',
                basePath: '/',
            });
            expect(result).toEqual({
                siteUrl: 'http://example.com/my/app/',
                basePath: '/my/app/',
            });
        });

        it('should normalize base path from URL with trailing slashes', () => {
            const result = normalizeUrlProps({
                siteUrl: 'http://example.com/app///',
                basePath: '/',
            });
            expect(result).toEqual({
                siteUrl: 'http://example.com/app/',
                basePath: '/app/',
            });
        });
    });

    describe('site URL validation', () => {
        it('should throw error for invalid URL', () => {
            expect(() =>
                normalizeUrlProps({ siteUrl: 'not a url', basePath: '/' }),
            ).toThrow('Invalid site URL: "not a url"');
        });

        it('should throw error for non-http protocol', () => {
            expect(() =>
                normalizeUrlProps({
                    siteUrl: 'ftp://example.com',
                    basePath: '/',
                }),
            ).toThrow('Site URL must use http or https (got ftp:)');
        });

        it('should throw error for file protocol', () => {
            expect(() =>
                normalizeUrlProps({
                    siteUrl: 'file:///path/to/file',
                    basePath: '/',
                }),
            ).toThrow('Site URL must use http or https (got file:)');
        });

        it('should throw error when URL contains query string', () => {
            expect(() =>
                normalizeUrlProps({
                    siteUrl: 'http://example.com?query=value',
                    basePath: '/',
                }),
            ).toThrow('Site URL must not include query or hash');
        });

        it('should throw error when URL contains hash', () => {
            expect(() =>
                normalizeUrlProps({
                    siteUrl: 'http://example.com#hash',
                    basePath: '/',
                }),
            ).toThrow('Site URL must not include query or hash');
        });

        it('should throw error when URL contains both query and hash', () => {
            expect(() =>
                normalizeUrlProps({
                    siteUrl: 'http://example.com?query=value#hash',
                    basePath: '/',
                }),
            ).toThrow('Site URL must not include query or hash');
        });
    });

    describe('explicit base path', () => {
        it('should use explicit base path when provided', () => {
            const result = normalizeUrlProps({
                siteUrl: 'http://example.com',
                basePath: '/app',
            });
            expect(result).toEqual({
                siteUrl: 'http://example.com/app/',
                basePath: '/app/',
            });
        });

        it('should normalize base path without leading slash', () => {
            const result = normalizeUrlProps({
                siteUrl: 'http://example.com',
                basePath: 'app',
            });
            expect(result).toEqual({
                siteUrl: 'http://example.com/app/',
                basePath: '/app/',
            });
        });

        it('should normalize base path with trailing slash', () => {
            const result = normalizeUrlProps({
                siteUrl: 'http://example.com',
                basePath: '/app/',
            });
            expect(result).toEqual({
                siteUrl: 'http://example.com/app/',
                basePath: '/app/',
            });
        });

        it('should normalize base path with multiple slashes', () => {
            const result = normalizeUrlProps({
                siteUrl: 'http://example.com',
                basePath: '///app///',
            });
            expect(result).toEqual({
                siteUrl: 'http://example.com/app/',
                basePath: '/app/',
            });
        });

        it('should handle root base path explicitly', () => {
            const result = normalizeUrlProps({
                siteUrl: 'http://example.com',
                basePath: '/',
            });
            expect(result).toEqual({
                siteUrl: 'http://example.com/',
                basePath: '/',
            });
        });

        it('should handle empty string as root base path', () => {
            const result = normalizeUrlProps({
                siteUrl: 'http://example.com',
                basePath: '',
            });
            expect(result).toEqual({
                siteUrl: 'http://example.com/',
                basePath: '/',
            });
        });

        it('should handle multi-segment base path', () => {
            const result = normalizeUrlProps({
                siteUrl: 'http://example.com',
                basePath: '/my/app/path',
            });
            expect(result).toEqual({
                siteUrl: 'http://example.com/my/app/path/',
                basePath: '/my/app/path/',
            });
        });
    });

    describe('base path validation', () => {
        it('should throw error when base path contains query string', () => {
            expect(() =>
                normalizeUrlProps({
                    siteUrl: 'http://example.com',
                    basePath: '/app?query=value',
                }),
            ).toThrow('Base path must not contain ? or #');
        });

        it('should throw error when base path contains hash', () => {
            expect(() =>
                normalizeUrlProps({
                    siteUrl: 'http://example.com',
                    basePath: '/app#hash',
                }),
            ).toThrow('Base path must not contain ? or #');
        });

        it('should throw error when base path looks like a URL', () => {
            expect(() =>
                normalizeUrlProps({
                    siteUrl: 'http://example.com',
                    basePath: 'http://other.com',
                }),
            ).toThrow('Base path must be a path, not a URL');
        });

        it('should throw error when base path contains ://', () => {
            expect(() =>
                normalizeUrlProps({
                    siteUrl: 'http://example.com',
                    basePath: 'some://path',
                }),
            ).toThrow('Base path must be a path, not a URL');
        });
    });

    describe('conflicting base paths', () => {
        it('should throw error when URL path and explicit base path conflict', () => {
            expect(() =>
                normalizeUrlProps({
                    siteUrl: 'http://example.com/app',
                    basePath: '/other',
                }),
            ).toThrow(
                'Conflicting base paths:\n' +
                    '  Site URL implies base path "/app/"\n' +
                    '  Explicitly set base path "/other/"\n\n' +
                    'Remove one of them or make them match.',
            );
        });

        it('should not conflict when URL path and explicit base path match', () => {
            const result = normalizeUrlProps({
                siteUrl: 'http://example.com/app',
                basePath: '/app',
            });
            expect(result).toEqual({
                siteUrl: 'http://example.com/app/',
                basePath: '/app/',
            });
        });

        it('should not conflict when URL path and explicit base path match with different slashes', () => {
            const result = normalizeUrlProps({
                siteUrl: 'http://example.com/app/',
                basePath: 'app',
            });
            expect(result).toEqual({
                siteUrl: 'http://example.com/app/',
                basePath: '/app/',
            });
        });

        it('should allow explicit base path when URL has no path', () => {
            const result = normalizeUrlProps({
                siteUrl: 'http://example.com',
                basePath: '/app',
            });
            expect(result).toEqual({
                siteUrl: 'http://example.com/app/',
                basePath: '/app/',
            });
        });

        it('should allow explicit base path when URL has only root path', () => {
            const result = normalizeUrlProps({
                siteUrl: 'http://example.com/',
                basePath: '/app',
            });
            expect(result).toEqual({
                siteUrl: 'http://example.com/app/',
                basePath: '/app/',
            });
        });
    });
});
