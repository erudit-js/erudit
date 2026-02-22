import {
  defineSchema,
  ensureTagBlockChildren,
  type BlockSchema,
  type Schema,
} from 'tsprose';

import { defineEruditTag } from '../../tag.js';
import type { NoToc } from '../../toc.js';
import type { NoSnippet } from '../../snippet.js';
import { EruditProseError } from '../../error.js';
import { paragraphWrap } from '../../shared/paragraphWrap.js';
import { defineProseCoreElement } from '../../coreElement.js';

export interface DetailsSchema extends Schema {
  name: 'details';
  type: 'block';
  linkable: 'always';
  Data: DetailsData;
  Storage: undefined;
  Children: BlockSchema[];
}

export interface DetailsData {
  title?: string;
}

export const detailsSchema = defineSchema<DetailsSchema>({
  name: 'details',
  type: 'block',
  linkable: 'always',
});

export const Details = defineEruditTag({
  tagName: 'Details',
  schema: detailsSchema,
})<{ title?: string } & NoToc & NoSnippet>(({
  element,
  tagName,
  children,
  props,
}) => {
  if (!element.uniqueName) {
    throw new EruditProseError(`<${tagName}> must be connected to unique!`);
  }

  const wrap = paragraphWrap(children);
  if (wrap) {
    element.children = wrap;
  } else {
    ensureTagBlockChildren(tagName, children);
    element.children = children;
  }

  const title = props.title?.trim();
  if (title) {
    element.data = { title };
    element.slug = title;
    element.title = title;
  }
});

export default defineProseCoreElement({
  schema: detailsSchema,
  tags: [Details],
});
