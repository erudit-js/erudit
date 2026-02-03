import {
  isolateProse,
  isRawElement,
  PROSE_REGISTRY,
  textSchema,
} from '@jsprose/core';
import { describe, expect, it } from 'vitest';

import { asEruditRaw } from '@erudit-js/prose';
import {
  paragraphRegistryItem,
  P,
} from '@erudit-js/prose/elements/paragraph/core';
import {
  Caption,
  captionRegistryItem,
  captionSchema,
} from '@erudit-js/prose/elements/caption/core';
import {
  Diagram,
  diagramRegistryItem,
  diagramSchema,
} from '@erudit-js/prose/elements/diagram/core';

const prepareRegistry = () =>
  PROSE_REGISTRY.setItems(
    diagramRegistryItem,
    captionRegistryItem,
    paragraphRegistryItem,
  );

describe('Diagram', () => {
  it('should create diagram correctly', () => {
    isolateProse(() => {
      prepareRegistry();

      const diagram = asEruditRaw(
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
  });

  it('should throw when wrong children are provided', () => {
    isolateProse(() => {
      prepareRegistry();

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
});
