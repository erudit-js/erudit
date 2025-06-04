import { trailingSlash, normalizeUrl } from '../../utils/url';

describe('trailingSlash', () => {
    describe('when add is true', () => {
        it('should add trailing slash to path without one', () => {
            expect(trailingSlash('/path', true)).toBe('/path/');
        });

        it('should preserve trailing slash when path already has one', () => {
            expect(trailingSlash('/path/', true)).toBe('/path/');
        });

        it('should return root path unchanged', () => {
            expect(trailingSlash('/', true)).toBe('/');
        });

        it('should add trailing slash to empty path', () => {
            expect(trailingSlash('', true)).toBe('/');
        });
    });

    describe('when add is false', () => {
        it('should remove trailing slash from path', () => {
            expect(trailingSlash('/path/', false)).toBe('/path');
        });

        it('should preserve path without trailing slash', () => {
            expect(trailingSlash('/path', false)).toBe('/path');
        });

        it('should return root path unchanged', () => {
            expect(trailingSlash('/', false)).toBe('/');
        });

        it('should handle empty path', () => {
            expect(trailingSlash('', false)).toBe('');
        });
    });
});

describe('normalizeUrl', () => {
    describe('with protocol', () => {
        it('should normalize multiple slashes in path', () => {
            expect(
                normalizeUrl('https://example.com//path//to///resource'),
            ).toBe('https://example.com/path/to/resource');
        });

        it('should preserve protocol and domain', () => {
            expect(normalizeUrl('https://example.com/path')).toBe(
                'https://example.com/path',
            );
        });

        it('should handle different protocols', () => {
            expect(normalizeUrl('http://example.com//path')).toBe(
                'http://example.com/path',
            );
        });

        it('should handle custom protocols', () => {
            expect(normalizeUrl('custom+protocol://example.com//path')).toBe(
                'custom+protocol://example.com/path',
            );
        });
    });

    describe('without protocol', () => {
        it('should normalize multiple slashes in relative path', () => {
            expect(normalizeUrl('/path//to///resource')).toBe(
                '/path/to/resource',
            );
        });

        it('should handle single slash', () => {
            expect(normalizeUrl('/')).toBe('/');
        });

        it('should normalize empty segments', () => {
            expect(normalizeUrl('///')).toBe('/');
        });

        it('should handle path without leading slash', () => {
            expect(normalizeUrl('path//to/resource')).toBe('path/to/resource');
        });
    });

    describe('edge cases', () => {
        it('should handle empty string', () => {
            expect(normalizeUrl('')).toBe('');
        });

        it('should handle query parameters and fragments', () => {
            expect(
                normalizeUrl('https://example.com//path?query=1#fragment'),
            ).toBe('https://example.com/path?query=1#fragment');
        });
    });
});
