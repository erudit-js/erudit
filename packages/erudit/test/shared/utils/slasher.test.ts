import { describe, it, expect } from 'vitest';

import { slasher } from '../../../shared/utils/slasher';

describe('slasher', () => {
    it('converts backslashes to forward slashes and dedupes by default', () => {
        expect(slasher('a\\b\\\\c')).toBe('a/b/c');
        expect(slasher('a////b//c')).toBe('a/b/c');
    });

    it('dedupes runs of slashes including leading and trailing by default', () => {
        expect(slasher('///a////b//c///')).toBe('/a/b/c/');
        expect(slasher('////')).toBe('/');
        expect(slasher('/')).toBe('/');
        expect(slasher('')).toBe('');
    });

    it('respects leading: true (ensure exactly one leading slash)', () => {
        expect(slasher('a/b', { leading: true })).toBe('/a/b');
        expect(slasher('///a/b', { leading: true })).toBe('/a/b');
        expect(slasher('', { leading: true })).toBe('/');
    });

    it('respects leading: false (remove all leading slashes)', () => {
        expect(slasher('///a/b', { leading: false })).toBe('a/b');
        expect(slasher('/a', { leading: false })).toBe('a');
    });

    it('respects trailing: true (ensure exactly one trailing slash)', () => {
        expect(slasher('a/b', { trailing: true })).toBe('a/b/');
        expect(slasher('a/b///', { trailing: true })).toBe('a/b/');
        expect(slasher('', { trailing: true })).toBe('/');
    });

    it('respects trailing: false (remove all trailing slashes)', () => {
        expect(slasher('a/b///', { trailing: false })).toBe('a/b');
        expect(slasher('/', { trailing: false })).toBe('');
    });

    it('respects toForward: false (do not convert backslashes)', () => {
        expect(slasher('a\\b\\\\c', { toForward: false })).toBe('a\\b\\\\c');
        // Forward slashes are still deduped by default
        expect(slasher('a\\b//c', { toForward: false })).toBe('a\\b/c');
    });

    it('respects dedupe: false (keep multiple slashes)', () => {
        expect(slasher('a////b//c', { dedupe: false })).toBe('a////b//c');
        // Leading/trailing options still apply even when dedupe is false
        expect(
            slasher('///a////b//c///', {
                leading: true,
                trailing: true,
                dedupe: false,
            }),
        ).toBe('/a////b//c/');
    });

    it('preserves protocol double slashes (http://, https://, file://)', () => {
        expect(slasher('http://example.com/path')).toBe(
            'http://example.com/path',
        );
        expect(slasher('https://example.com/path')).toBe(
            'https://example.com/path',
        );
        expect(slasher('file://C:/path/to/file')).toBe(
            'file://C:/path/to/file',
        );
        expect(slasher('http://example.com//path///to//resource')).toBe(
            'http://example.com/path/to/resource',
        );
        expect(slasher('https://example.com/', { trailing: false })).toBe(
            'https://example.com',
        );
    });
});
