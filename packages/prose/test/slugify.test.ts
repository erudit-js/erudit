import { describe, it, expect } from 'vitest';

import { createDefaultSlugify } from '@src/slugify/index.js';

describe('Default Slugifiers', () => {
  describe('English', async () => {
    const enSlugify = await createDefaultSlugify({ language: 'en' });

    it.each([
      ['Hello World', 'hello-world'],
      ['-!Hello --World!-', 'hello-world'],
      ['Test@@@     Example', 'test-example'],
      ['hello_world_123', 'hello-world-123'],
      ['fooBAZbar', 'foo-baz-bar'],
      ['fooBazBar1998', 'foo-baz-bar-1998'],
      ['!@#$%', ''],
      ['   ', ''],
      ['', ''],
    ])('"%s" -> %s', async (input, expected) => {
      const result = enSlugify(input);
      expected === undefined
        ? expect(result).toBeUndefined()
        : expect(result).toBe(expected);
    });
  });

  describe('Russian', async () => {
    const ruSlugify = await createDefaultSlugify({ language: 'ru' });

    it.each([
      ['--Привет мир', 'privet-mir'],
      ['Ёлка и хлеб', 'elka-i-khleb'],
      ['Щука, жаба и--цапля', 'schuka-zhaba-i-tsaplya'],
      ['Объявление   съемка', 'obyavlenie-semka'],
      ['Test тест 123', 'test-test-123'],
      ['fooBAZbarТест', 'foo-baz-bar-test'],
      ['fooBazBar1998', 'foo-baz-bar-1998'],
      ['приветМир', 'privet-mir'],
      ['!@#$%', ''],
      ['   ', ''],
      ['', ''],
    ])('"%s" -> %s', async (input, expected) => {
      expect(ruSlugify(input)).toBe(expected);
    });
  });

  it('unsupported language returns text as is', async () => {
    const unknownSlugify = await createDefaultSlugify({
      language: 'xyz',
    } as any);
    expect(unknownSlugify('Hello World')).toBe('Hello World');
  });
});
