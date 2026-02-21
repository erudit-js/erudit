import { isUnique, type RawElement, type Unique } from 'tsprose';

import type { EruditRawElement } from './rawElement.js';
import { finalizeToc } from './toc.js';

const ERUDIT_INCLUDE_FLAG = '__ERUDIT_included';

export function Include(props: {
  children: Unique | RawElement;
  toc?: true | string;
}): RawElement {
  const rawElement = isUnique(props.children)
    ? props.children.rawElement
    : props.children;

  function augmentRawElement(element: EruditRawElement) {
    const isRoot = element === rawElement;

    if (isRoot) {
      if (props.toc) {
        if (props.toc === true) {
          finalizeToc(element, true);
        } else {
          finalizeToc(element, props.toc);
        }
      } else {
        delete element.toc;
      }
    } else {
      delete element.toc;
    }

    delete element.snippet;
    delete element.uniqueName;

    (element as any)[ERUDIT_INCLUDE_FLAG] = true;

    if (element.children) {
      for (const child of element.children) {
        augmentRawElement(child as EruditRawElement);
      }
    }
  }

  augmentRawElement(rawElement as EruditRawElement);

  return rawElement;
}

export function isIncludedRawElement(rawElement: RawElement): boolean {
  return (rawElement as any)[ERUDIT_INCLUDE_FLAG] === true;
}
