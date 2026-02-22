import { describe, expect, it } from 'vitest';
import { isRawElement, textSchema } from 'tsprose';

import { asEruditRaw } from '@src/rawElement';
import {
  Caption,
  CaptionSecondary,
  captionSecondarySchema,
  type CaptionSchema,
} from '@src/elements/caption/core.js';
import { P } from '@src/elements/paragraph/core';

describe('Caption', () => {
  it('should create correctly create caption with only main', () => {
    const caption = asEruditRaw<CaptionSchema>(
      <Caption width="200px">Main caption</Caption>,
    );

    expect(caption.data).toStrictEqual({ width: '200px' });
    expect(caption.children).toHaveLength(1);
    expect(isRawElement(caption.children![0], textSchema)).toBe(true);
  });

  it('should correctly create caption with main and secondary', () => {
    const caption = asEruditRaw(
      <Caption>
        Main caption
        <CaptionSecondary>Secondary caption</CaptionSecondary>
      </Caption>,
    );

    expect(caption.data).toBeUndefined();
    expect(caption.children).toHaveLength(2);
    expect(isRawElement(caption.children![0], textSchema)).toBe(true);
    expect(isRawElement(caption.children![1], captionSecondarySchema)).toBe(
      true,
    );
  });

  it('should throw when wrong children are provided', () => {
    // Block instead of inliner
    expect(() => (
      <Caption>
        <P>Wrong paragraph</P>
      </Caption>
    )).toThrow();

    // Secondary without main
    expect(() => (
      <Caption>
        <CaptionSecondary>Secondary without main</CaptionSecondary>
      </Caption>
    )).toThrow(/without a main caption/);

    // More than two secondary children
    expect(() => (
      <Caption>
        Main content
        <CaptionSecondary>Secondary 1</CaptionSecondary>
        <CaptionSecondary>Secondary 2</CaptionSecondary>
      </Caption>
    )).toThrow(/Duplicate/);
  });
});
