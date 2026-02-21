import { describe, expect, it } from 'vitest';
import { isRawElement, textSchema } from 'tsprose';

import { asEruditRaw } from '@src/rawElement';
import {
  type DiagramSchema,
  diagramSchema,
  Diagram,
} from '@src/elements/diagram/core';
import { Caption, captionSchema } from '@src/elements/caption/core';
import { P } from '@src/elements/paragraph/core';

describe('Diagram', () => {
  it('should create diagram correctly', () => {
    const diagram = asEruditRaw<DiagramSchema>(
      <Diagram>
        Diagram Content
        <Caption>Caption</Caption>
      </Diagram>,
    );

    expect(isRawElement(diagram, diagramSchema)).toBe(true);
    expect(diagram.children).toHaveLength(2);
    expect(isRawElement(diagram.children![0], textSchema)).toBe(true);
    expect(isRawElement(diagram.children![1], captionSchema)).toBe(true);

    expect(() => <Diagram>Only Content</Diagram>).not.toThrow();
  });

  it('should throw when wrong children are provided', () => {
    // Not text first child
    expect(() => (
      <Diagram>
        <P>Paragraph instead of text</P>
        <Caption>Caption</Caption>
      </Diagram>
    )).toThrow();

    // Caption first child
    expect(() => (
      <Diagram>
        <Caption>Caption</Caption>
      </Diagram>
    )).toThrow();

    // Second child is not caption
    expect(() => (
      <Diagram>
        Diagram Content
        <P>Paragraph instead of caption</P>
      </Diagram>
    )).toThrow();
  });
});
