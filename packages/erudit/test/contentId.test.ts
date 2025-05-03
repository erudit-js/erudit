import {
    toAbsoluteContentPath,
    resolveContentPath,
} from '@erudit/shared/bitran/contentId';

describe('resolveContentPath', () => {
    it('should handle empty paths', () => {
        expect(resolveContentPath('')).toBe('');
    });

    it('should not change paths without special symbols', () => {
        expect(resolveContentPath('foo/bar/baz')).toBe('foo/bar/baz');
    });

    it('should skip empty path parts', () => {
        expect(resolveContentPath('/foo///bar/baz/')).toBe('foo/bar/baz');
    });

    it('should handle ".." parts', () => {
        const testCases = [
            ['foo/bar/../baz', 'foo/baz'],
            ['../../../foo/bar/baz', 'foo/bar/baz'],
            ['foo/../../../bar/baz', 'bar/baz'],
            ['../../..', ''],
        ];

        for (const [input, expected] of testCases) {
            expect(resolveContentPath(input!)).toBe(expected);
        }
    });

    it('should handle "." parts', () => {
        const testCases = [
            ['.', ''],
            ['./foo/bar/baz', 'foo/bar/baz'],
            ['./foo/./bar', 'foo/bar'],
            ['foo/./././bar', 'foo/bar'],
        ];

        for (const [input, expected] of testCases) {
            expect(resolveContentPath(input!)).toBe(expected);
        }
    });

    it('should handle paths with both "." and ".." parts', () => {
        const testCases = [
            ['./../.', ''],
            ['foo/./../bar', 'foo/bar'],
        ];

        for (const [input, expected] of testCases) {
            expect(resolveContentPath(input!)).toBe(expected);
        }
    });
});

describe('toAbsoluteContentPath', () => {
    const bookIds = ['combinatorics', 'group/book'];

    it('should not use context on absolute paths', () => {
        expect(
            toAbsoluteContentPath('/foo/bar/../baz', 'qux/vaz', bookIds),
        ).toBe('foo/baz');
    });

    it('should fallback to absolute path if not inside book', () => {
        expect(
            toAbsoluteContentPath('~/foo/bar', 'unknown-book', bookIds),
        ).toBe('foo/bar');
    });

    it('should correctly handle book-relative paths', () => {
        expect(toAbsoluteContentPath('~/foo/bar', 'group/book', bookIds)).toBe(
            'group/book/foo/bar',
        );
    });

    it('should by default append context before given content id', () => {
        const testCases = [
            ['baz/qux', 'foo/bar', 'foo/bar/baz/qux'],
            ['./baz/qux', 'foo/bar', 'foo/bar/baz/qux'],
            ['../baz/qux', 'foo/bar', 'foo/baz/qux'],
        ];

        for (const [contentId, context, expected] of testCases) {
            expect(toAbsoluteContentPath(contentId!, context!, bookIds)).toBe(
                expected,
            );
        }
    });
});
