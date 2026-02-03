import { describe, it, expect } from 'vitest';

import { slugify } from '@erudit-js/prose';

describe('slugify', () => {
  describe('English', () => {
    const cases: Array<[string, string | undefined]> = [
      ['Hello World', 'hello-world'], // basic lowercase + spaces -> dash
      ['-!Hello World!-', 'hello-world'], // leading/trailing punctuation trimmed after normalization
      ['Test@@@Example', 'test-example'], // multiple special -> single dash collapse
      ['hello_world_123', 'hello-world-123'], // underscore + numbers
      ['!@#$%', undefined], // becomes empty after cleanup
    ];

    for (const [input, expected] of cases) {
      it(`"${input}" -> ${expected ?? 'undefined'}`, async () => {
        const result = await slugify(input, 'en');
        expected === undefined
          ? expect(result).toBeUndefined()
          : expect(result).toBe(expected);
      });
    }
  });

  describe('Russian', () => {
    const cases: Array<[string, string]> = [
      ['--Привет мир', 'privet-mir'], // basic transliteration
      ['Ёлка и хлеб', 'elka-i-khleb'], // ё -> e, х -> kh
      ['Щука, жаба и--цапля', 'schuka-zhaba-i-tsaplya'], // щ, ж, ц, я mappings
      ['Объявление съемка', 'obyavlenie-semka'], // ъ & ь removed, й -> y
      ['Test тест 123', 'test-test-123'], // mixed Latin + Cyrillic + numbers
    ];

    for (const [input, expected] of cases) {
      it(`"${input}" -> ${expected}`, async () => {
        const result = await slugify(input, 'ru');
        expect(result).toBe(expected);
      });
    }
  });

  it('empty string returns undefined', async () => {
    const result = await slugify('', 'en');
    expect(result).toBeUndefined();
  });

  it('unsupported language returns undefined', async () => {
    const result = await slugify('Hello World', 'xyz');
    expect(result).toBeUndefined();
  });
});
