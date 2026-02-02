import { ProseError, type AnySchema, type ProseElement } from '@jsprose/core';

import type { EruditProcessTagArgs } from './tag.js';
import { defineResolveStep } from './resolveStep.js';
import type { EruditRawElement } from './rawElement.js';

/**
 * Snippet attribute - only contains title and description
 */
export interface SnippetData {
  /** General snippet title. Used as fallback value for flags. */
  title?: string;
  /** General snippet description. Used as fallback value for flags. */
  description?: string;
  /**
   * Show element in search results.
   */
  search?:
    | boolean
    | string
    | string[]
    | {
        title?: string;
        description?: string;
        synonyms?: string[];
      };
  /**
   * Show element in "Quick Links" sections at start of the page and also in TOC.
   */
  quick?:
    | boolean
    | string
    | {
        title?: string;
        description?: string;
      };
  /**
   * When targeting this element with '#' anchor, adjust SEO metadata (like title and description).
   * Search engines should treat it as a different "page" and therefore show it as a standalone search result.
   */
  seo?:
    | boolean
    | string
    | {
        title?: string;
        description?: string;
      };
}

export type ObjPropSnippet = {
  /**
   * Compact summary of the element and where to show it (search, quick links, SEO).
   */
  snippet?: SnippetData;
};

export type ObjRawElementSnippet = {
  snippet?: SnippetData;
};

export function finalizeSnippet(
  processTagArgs: EruditProcessTagArgs,
): SnippetData | undefined {
  const finalSnippet: SnippetData = {};
  const propsSnippet = processTagArgs.props.snippet as SnippetData | undefined;
  const builtinSnippet = processTagArgs.element.snippet as
    | SnippetData
    | undefined;

  //

  const quick = propsSnippet?.quick ?? builtinSnippet?.quick;

  if (quick) {
    finalSnippet.quick = quick;
  }

  //

  const search = propsSnippet?.search ?? builtinSnippet?.search;

  if (search) {
    finalSnippet.search = search;
  }

  //

  let seo = propsSnippet?.seo ?? builtinSnippet?.seo;

  // If none of the flags are set to true, no snippet is created
  if (!quick && !search && !seo) {
    return undefined;
  }

  // Enable SEO if either quick or search is enabled unless SEO is explicitly disabled
  // Check both element defaults and props - if either explicitly disables seo, don't auto-enable
  const seoExplicitlyDisabled =
    builtinSnippet?.seo === false || propsSnippet?.seo === false;

  if (!seo) {
    if (!seoExplicitlyDisabled) {
      if (quick || search) {
        seo = true;
      }
    }
  }

  if (seo) {
    finalSnippet.seo = seo;
  }

  //

  const title = getGenericTitle(processTagArgs);

  if (title) {
    finalSnippet.title = title;
  }

  const description = getGenericDescription(processTagArgs);

  if (description) {
    finalSnippet.description = description;
  }

  //

  if (!finalSnippet.title) {
    let titlessFlags: string[] = [];

    if (quick && typeof quick !== 'string') {
      if (quick === true || !quick.title) {
        titlessFlags.push('quick');
      }
    }

    if (search && typeof search !== 'string') {
      if (search === true || Array.isArray(search) || !search.title) {
        titlessFlags.push('search');
      }
    }

    if (seo && typeof seo !== 'string') {
      if (seo === true || !seo.title) {
        titlessFlags.push('seo');
      }
    }

    throw new ProseError(
      `Unable to get title for snippet flags (${titlessFlags.join(', ')}) because no explicit, general inherited title was provided!`,
    );
  }

  //

  processTagArgs.element.snippet = finalSnippet;
  return finalSnippet;
}

function getGenericTitle(
  processTagArgs: EruditProcessTagArgs,
): string | undefined {
  const title =
    processTagArgs.props.snippet?.title?.trim() ||
    processTagArgs.element.snippet?.title?.trim() ||
    processTagArgs.element.title?.trim();

  return title;
}

function getGenericDescription(
  processTagArgs: EruditProcessTagArgs,
): string | undefined {
  return (
    processTagArgs.props.snippet?.description?.trim() ||
    processTagArgs.element.snippet?.description?.trim()
  );
}

//
// Resolve
//

export interface ResolvedSnippet {
  schemaName: string;
  isUnique: boolean;
  elementId: string;
  snippetData: SnippetData;
}

export const snippetStep = defineResolveStep(({ rawElement, proseElement }) => {
  if (rawElement.snippet && proseElement.id) {
    const resolvedSnippet: ResolvedSnippet = {
      schemaName: rawElement.schemaName,
      isUnique: Boolean(rawElement.uniqueName),
      elementId: proseElement.id,
      snippetData: rawElement.snippet,
    };

    return resolvedSnippet;
  }
});
