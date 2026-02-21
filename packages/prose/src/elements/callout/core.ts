import {
  defineSchema,
  ensureTagBlockChildren,
  type BlockSchema,
  type Schema,
} from 'tsprose';

import type { Invert } from '../../shared/invert.js';
import { defineEruditTag } from '../../tag.js';
import { defineProseCoreElement } from '../../coreElement.js';
import { paragraphWrap } from '../../shared/paragraphWrap.js';

export interface CalloutData {
  iconSrc: string;
  iconInvert?: Invert;
  title: string;
}

export interface CalloutStorage {
  resolvedIconSrc: string;
}

export interface CalloutSchema extends Schema {
  name: 'callout';
  type: 'block';
  linkable: true;
  Data: CalloutData;
  Storage: CalloutStorage;
  Children: BlockSchema[];
}

export const calloutSchema = defineSchema<CalloutSchema>({
  name: 'callout',
  type: 'block',
  linkable: true,
});

export const Callout = defineEruditTag({
  tagName: 'Callout',
  schema: calloutSchema,
})<{ icon: string; invert?: Invert; title: string }>(({
  element,
  tagName,
  props,
  children,
}) => {
  const wrap = paragraphWrap(children);
  if (wrap) {
    element.children = wrap;
  } else {
    ensureTagBlockChildren(tagName, children);
    element.children = children;
  }

  element.data = {
    iconSrc: props.icon,
    title: props.title,
  };

  element.storageKey = props.icon;

  if (props.invert) {
    element.data.iconInvert = props.invert;
  }
});

export default defineProseCoreElement({
  schema: calloutSchema,
  tags: [Callout],
  rawToProseHook: ({ result }) => {
    return {
      matchStep: ({ rawElement }) => {
        result.files.add(rawElement.data.iconSrc);
      },
    };
  },
});
