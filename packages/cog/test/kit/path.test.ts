import { forwardSlashPath } from '../../src/kit';

describe('forwardSlashPath', () => {
    it.each(['a/b/c', '/a/b/c', 'a/b/c/', './a/b/c', '.', '..', 'a/b/../c'])(
        'should not change %s',
        (path) => {
            expect(forwardSlashPath(path)).toBe(path);
        },
    );

    it.each([
        ['a\\b\\c', 'a/b/c'],
        ['D:\\code\\erudit-monorepo', 'D:/code/erudit-monorepo'],
    ])('should change %s', (path, expected) => {
        expect(forwardSlashPath(path)).toBe(expected);
    });
});
