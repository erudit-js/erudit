import { test, expect } from 'vitest';

import { zip, unzip } from '../../../shared/utils/zip';

test('zip/unzip', async () => {
    const text = 'Hello мир 🌍!';
    expect(await unzip(await zip(text))).toBe(text);
});
