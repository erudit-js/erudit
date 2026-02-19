import { describe, expect, it } from 'vitest';

import { extractTagDocs } from '@src/utils/docs';

describe('extractTagDocs', () => {
  it('should return undefined when no JSDoc blocks are present', () => {
    expect(extractTagDocs('MyTag', '')).toBeUndefined();
    expect(extractTagDocs('MyTag', 'let MyTag;')).toBeUndefined();
  });

  it('should return jsdoc block for single tag declaration', () => {
    const doc = `
/**
 * This is MyTag documentation.
 * It has multiple lines.
 */
let MyTag;
        `;

    const result = extractTagDocs('MyTag', doc);
    expect(result).toBeDefined();
    expect(result).toContain('This is MyTag documentation.');
    expect(result).not.toContain('let MyTag;');
  });

  it('should return jsdoc block for multiple tag declarations', () => {
    const doc = `
/**
 * Documentation for TagA, TagB and TagC.
 */
let TagA, TagB, TagC;
        `;

    const resultB = extractTagDocs('TagB', doc);
    expect(resultB).toBeDefined();
    expect(resultB).toContain('Documentation for TagA, TagB and TagC.');
    expect(resultB).not.toContain('let TagA, TagB, TagC;');
  });

  it('should return jsdoc block for multi-line tag declarations', () => {
    const doc = `
/**
 * Documentation for MultiTag1 and MultiTag2.
 */
let MultiTag1,
    MultiTag2;
        `;

    const result2 = extractTagDocs('MultiTag2', doc);
    expect(result2).toBeDefined();
    expect(result2).toContain('Documentation for MultiTag1 and MultiTag2.');
    expect(result2).not.toContain('let MultiTag1,');
    expect(result2).not.toContain('MultiTag2;');
  });
});
