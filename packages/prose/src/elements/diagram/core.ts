import {
  defineSchema,
  ensureRawElement,
  ensureTagChildren,
  textSchema,
  type Schema,
  type TextSchema,
} from 'tsprose';

import { captionSchema, type CaptionSchema } from '../caption/core.js';
import { defineEruditTag } from '../../tag.js';
import { photoswipeDependency } from '../../shared/photoswipe.js';
import { defineProseCoreElement } from '../../coreElement.js';

export interface DiagramSchema extends Schema {
  name: 'diagram';
  type: 'block';
  linkable: true;
  Data: undefined;
  Storage: undefined;
  Children: [TextSchema] | [TextSchema, CaptionSchema];
}

export const diagramSchema = defineSchema<DiagramSchema>({
  name: 'diagram',
  type: 'block',
  linkable: true,
});

export const Diagram = defineEruditTag({
  tagName: 'Diagram',
  schema: diagramSchema,
})(({ element, tagName, children }) => {
  ensureTagChildren(tagName, children, [textSchema, captionSchema]);

  ensureRawElement(children[0], textSchema);
  element.children = [children[0]];

  if (children[1]) {
    ensureRawElement(children[1], captionSchema);
    element.children = [children[0], children[1]];
  }
});

export default defineProseCoreElement({
  schema: diagramSchema,
  tags: [Diagram],
  dependencies: {
    ...photoswipeDependency,
    ...{
      mermaid: {
        optimize: true,
        transpile: true,
      },
    },
  },
});
