import {
  defineSchema,
  ensureTagSingleChild,
  textSchema,
  type NormalizedChildren,
  type RequiredChildren,
  type Schema,
} from 'tsprose';

import { defineEruditTag } from '../../tag.js';
import type { ToEruditRawElement } from '../../rawElement.js';
import { EruditProseError } from '../../error.js';
import { defineProseCoreElement } from '../../coreElement.js';
import type { NoToc } from '../../toc.js';

export interface HeadingSchema extends Schema {
  name: 'heading';
  type: 'block';
  linkable: true;
  Data: HeadingData;
  Storage: undefined;
  Children: undefined;
}

export const headingSchema = defineSchema<HeadingSchema>({
  name: 'heading',
  type: 'block',
  linkable: true,
});

export interface HeadingData {
  level: 1 | 2 | 3;
  title: string;
}

export type HeadingProps = NoToc & RequiredChildren;

export const H1 = defineEruditTag({
  tagName: 'H1',
  schema: headingSchema,
})<HeadingProps>(({ tagName, element, children }) => {
  processHeadingElement(1, tagName, element, children);
});

export const H2 = defineEruditTag({
  tagName: 'H2',
  schema: headingSchema,
})<HeadingProps>(({ tagName, element, children }) => {
  processHeadingElement(2, tagName, element, children);
});

export const H3 = defineEruditTag({
  tagName: 'H3',
  schema: headingSchema,
})<HeadingProps>(({ tagName, element, children }) => {
  processHeadingElement(3, tagName, element, children);
});

function processHeadingElement(
  level: 1 | 2 | 3,
  tagName: string,
  element: ToEruditRawElement<HeadingSchema>,
  children: NormalizedChildren,
) {
  ensureTagSingleChild(tagName, children, textSchema);
  const child = children[0];
  const title = child.data.trim();

  if (!title) {
    throw new EruditProseError(`<${tagName}> title cannot be empty!`);
  }

  element.data = {
    level,
    title,
  };

  element.title = title;
  element.toc = true;
}

export default defineProseCoreElement({
  schema: headingSchema,
  tags: [H1, H2, H3],
});
