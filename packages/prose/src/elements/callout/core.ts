import {
  defineRegistryItem,
  defineSchema,
  ensureTagBlockChildren,
  isRawElement,
  type BlockSchema,
  type TagChildren,
} from '@jsprose/core';

import type { Invert } from '../../shared/invert.js';
import { defineEruditTag } from '../../tag.js';
import { defineEruditProseCoreElement } from '../../coreElement.js';
import { defineResolveStep } from '../../resolveStep.js';

export interface CalloutData {
  iconSrc: string;
  iconInvert?: Invert;
  title: string;
}

export interface CalloutStorage {
  resolvedIconSrc: string;
}

export const calloutSchema = defineSchema({
  name: 'callout',
  type: 'block',
  linkable: true,
})<{
  Data: CalloutData;
  Storage: CalloutStorage;
  Children: BlockSchema[];
}>();

export const Callout = defineEruditTag({
  tagName: 'Callout',
  schema: calloutSchema,
})<{ icon: string; invert?: Invert; title: string } & TagChildren>(({
  element,
  tagName,
  props,
  children,
  registry,
}) => {
  ensureTagBlockChildren(tagName, children, registry);
  element.children = children;

  element.data = {
    iconSrc: props.icon,
    title: props.title,
  };

  element.storageKey = props.icon;

  if (props.invert) {
    element.data.iconInvert = props.invert;
  }
});

export const calloutRegistryItem = defineRegistryItem({
  schema: calloutSchema,
  tags: [Callout],
});

export default defineEruditProseCoreElement({
  registryItem: calloutRegistryItem,
});

//
// Resolve
//

export const calloutIconSrcStep = defineResolveStep(({ rawElement }) => {
  if (isRawElement(rawElement, calloutSchema)) {
    return rawElement.data.iconSrc;
  }
});
