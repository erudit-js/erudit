import { headingSchema } from './elements/heading/core.js';
import { EruditProseError } from './error.js';
import { defineRawToProseHook } from './rawToProse/hook.js';
import { isEruditRawElement, type EruditRawElement } from './rawElement.js';

export const NO_TOC_PREFIX = '__ERDUIT_tagNoToc';
export type NoToc = { [NO_TOC_PREFIX]: true };

export interface TocTagProp {
  /** Whether to include the element in the table of contents. */
  toc?: boolean | string;
}

export interface TocRawElementProp {
  toc?: string | boolean;
}

export function finalizeToc(
  rawElement: EruditRawElement,
  tocTagProp: TocTagProp['toc'],
): void {
  if (tocTagProp === false) {
    // Explicitly prohibit to add to TOC
    rawElement.toc = false;
    return;
  }

  if (typeof tocTagProp === 'string') {
    // Explicitly add to TOC with custom title
    const tocString = tocTagProp.trim();
    if (!tocString) {
      throw new EruditProseError(
        'Addition to TOC was requested via direct tag toc prop but it is an empty string!',
      );
    }
    rawElement.toc = tocString;
    return;
  }

  if (rawElement.toc === true) {
    // Implicitly add to TOC using general title, fall back to finalized snippet title
    const tocString =
      rawElement.title?.trim() || rawElement.snippet?.title?.trim();
    if (!tocString) {
      throw new EruditProseError(
        'Addition to TOC was requested via internal toc: true flag, but unable to retrieve title!',
      );
    }
    rawElement.toc = tocString;
    return;
  }

  if (rawElement.toc === false) {
    // Implicitly set to not to add to TOC
    return;
  }

  if (tocTagProp === true) {
    // Explicitly add to TOC using general internal toc string, general title, or finalized snippet title
    const tocString =
      rawElement.toc?.trim() ||
      rawElement.title?.trim() ||
      rawElement.snippet?.title?.trim();
    if (!tocString) {
      throw new EruditProseError(
        'Addition to TOC was manually requested via true tag toc prop, but unable to retrieve title!',
      );
    }
    rawElement.toc = tocString;
    return;
  }

  if (typeof rawElement.toc === 'string') {
    // Check if internal toc string is valid
    const tocString = rawElement.toc?.trim();
    if (!tocString) {
      throw new EruditProseError(
        'Addition to TOC was requested via internal toc string, but it is empty!',
      );
    }
    rawElement.toc = tocString;
  }
}

//
// Resolve
//

export type ResolvedTocHeading = {
  type: 'heading';
  level: 1 | 2 | 3;
  title: string;
  elementId: string;
  children: ResolvedTocItem[];
};

export type ResolvedTocElement = {
  type: 'element';
  schemaName: string;
  title: string;
  elementId: string;
};

export type ResolvedTocItem = ResolvedTocHeading | ResolvedTocElement;

export const tocHook = defineRawToProseHook(({ task: context, result }) => {
  if (!context.toc?.enabled) {
    return;
  }

  const addSchemas = context.toc?.addSchemas || [];
  const headingStack: ResolvedTocItem[] = [];

  return {
    step: ({ rawElement, proseElement }) => {
      let tocItem: ResolvedTocItem | undefined;

      if (proseElement.id) {
        if (typeof rawElement.toc === 'string') {
          if (isEruditRawElement(rawElement, headingSchema)) {
            tocItem = {
              type: 'heading',
              level: rawElement.data.level,
              title: rawElement.toc,
              elementId: proseElement.id,
              children: [],
            } satisfies ResolvedTocHeading;
          } else {
            tocItem = {
              type: 'element',
              schemaName: rawElement.schema.name,
              title: rawElement.toc,
              elementId: proseElement.id,
            } satisfies ResolvedTocElement;
          }
        }

        // Try force add specified schemas
        // Only attempt for elements where toc was never explicitly excluded.
        if (
          !tocItem &&
          rawElement.toc !== false &&
          addSchemas.some((schema) => isEruditRawElement(rawElement, schema))
        ) {
          try {
            finalizeToc(rawElement, true);
            if (typeof rawElement.toc === 'string') {
              tocItem = {
                type: 'element',
                schemaName: rawElement.schema.name,
                title: rawElement.toc,
                elementId: proseElement.id,
              } satisfies ResolvedTocElement;
            }
          } catch {}
        }
      }

      if (tocItem) {
        if (tocItem.type === 'heading') {
          // Pop headings from stack that are same level or deeper
          while (headingStack.length > 0) {
            const lastItem = headingStack[headingStack.length - 1];
            if (
              lastItem.type === 'heading' &&
              lastItem.level >= tocItem.level
            ) {
              headingStack.pop();
            } else {
              break;
            }
          }

          // Add to parent or root
          if (headingStack.length > 0) {
            const parent = headingStack[headingStack.length - 1];
            if (parent.type === 'heading') {
              parent.children.push(tocItem);
            }
          } else {
            result.toc.push(tocItem);
          }

          // Push this heading to stack
          headingStack.push(tocItem);
        } else {
          // Non-heading item: add to most recent heading or root
          if (headingStack.length > 0) {
            const parent = headingStack[headingStack.length - 1];
            if (parent.type === 'heading') {
              parent.children.push(tocItem);
            }
          } else {
            result.toc.push(tocItem);
          }
        }
      }
    },
  };
});
