import { EruditProseError } from './error.js';
import { defineRawToProseHook } from './rawToProse/hook.js';
import type { EruditRawElement } from './rawElement.js';

export const NO_SNIPPET_PREFIX = '__ERDUIT_tagNoSnippet';
export type NoSnippet = { [NO_SNIPPET_PREFIX]: true };

export interface SnippetTagProp {
  /** Compact summary of the element and where to show it (search results, preamble, SEO). */
  snippet?: SnippetRaw;
}

export interface SnippetRawElementProp {
  snippet?: SnippetRaw;
}

export interface SnippetRaw {
  title?: string;
  description?: string;
  /** Show element in search results. */
  search?:
    | boolean
    | string
    | string[]
    | { title?: string; description?: string; synonyms?: string[] };
  /** Show element in "Key elements" section of content preamble. */
  key?: boolean | string | { title?: string; description?: string };
  /**
   * Set custom page SEO metadata when targeting this element.
   * Search engines treat it as a different "page" and therefore show it as a standalone search result.
   */
  seo?: boolean | string | { title?: string; description?: string };
}

export type Snippet = Omit<SnippetRaw, 'title'> & { title: string };

export function finalizeSnippet(
  rawElement: EruditRawElement,
  snippetTagProp: SnippetTagProp['snippet'],
): void {
  if (snippetTagProp) {
    // Explicitly add snippet using tag prop data
    const normalizedSnippet = normalizeSnippet(
      snippetTagProp,
      rawElement.snippet?.title,
      rawElement.title,
    );

    const tagPropHadExplicitSeo = snippetTagProp.seo !== undefined;

    if (rawElement.snippet) {
      const normalizedInternalSnippet = normalizeSnippet(
        rawElement.snippet,
        rawElement.title,
      );

      // Merge internal snippet data as fallback for missing values in tag prop snippet

      if (
        !normalizedSnippet.description &&
        normalizedInternalSnippet.description
      ) {
        normalizedSnippet.description = normalizedInternalSnippet.description;
      }

      if (
        normalizedSnippet.search === undefined &&
        normalizedInternalSnippet.search
      ) {
        normalizedSnippet.search = normalizedInternalSnippet.search;
      }

      if (
        normalizedSnippet.key === undefined &&
        normalizedInternalSnippet.key
      ) {
        normalizedSnippet.key = normalizedInternalSnippet.key;
      }

      if (
        normalizedSnippet.seo === undefined &&
        normalizedInternalSnippet.seo
      ) {
        normalizedSnippet.seo = normalizedInternalSnippet.seo;
      }
    }

    // Add snippet to SEO if either search or key is enabled unless SEO was explicitly set in the tag prop
    if (
      !tagPropHadExplicitSeo &&
      normalizedSnippet.seo !== false &&
      (normalizedSnippet.search || normalizedSnippet.key)
    ) {
      normalizedSnippet.seo = true;
    }

    // Prune snippet if it has no active features
    if (
      !normalizedSnippet.search &&
      !normalizedSnippet.key &&
      !normalizedSnippet.seo
    ) {
      delete rawElement.snippet;
      return;
    }

    rawElement.snippet = normalizedSnippet;
    return;
  }

  if (rawElement.snippet) {
    // This snippet was supposed to be used to merge data but not needed anymore because tag prop snippet is not provided
    delete rawElement.snippet;
    return;
  }
}

export function normalizeSnippet(
  snippet: SnippetRaw,
  ...fallbackTitles: (string | undefined)[]
): Snippet {
  const title =
    snippet.title?.trim() || fallbackTitles.map((t) => t?.trim()).find(Boolean);

  if (!title) {
    throw new EruditProseError(
      'Unable to retrieve non-empty title for snippet!',
    );
  }

  const description = snippet.description?.trim() || undefined;

  const result: Snippet = {
    ...snippet,
    title,
    description,
  };

  return result;
}

export interface SearchSnippet {
  title: string;
  description?: string;
  synonyms?: string[];
}

export function toSearchSnippet(snippet?: Snippet): SearchSnippet | undefined {
  if (!snippet || !snippet.search) {
    return undefined;
  }

  if (snippet.search === true) {
    return {
      title: snippet.title,
      description: snippet.description,
    };
  }

  if (typeof snippet.search === 'string') {
    const title = snippet.search.trim() || snippet.title;
    return {
      title,
      description: snippet.description,
    };
  }

  if (Array.isArray(snippet.search)) {
    const synonyms = snippet.search
      .map((synonym) => synonym.trim())
      .filter(Boolean);
    return {
      title: snippet.title,
      description: snippet.description,
      synonyms: synonyms.length > 0 ? synonyms : undefined,
    };
  }

  const title = snippet.search.title?.trim() || snippet.title;
  const description = snippet.search.description?.trim() || snippet.description;
  const synonyms = snippet.search.synonyms
    ?.map((synonym) => synonym.trim())
    .filter(Boolean);

  return {
    title,
    description,
    synonyms: synonyms && synonyms.length > 0 ? synonyms : undefined,
  };
}

export interface KeySnippet {
  title: string;
  description?: string;
}

export function toKeySnippet(snippet?: Snippet): KeySnippet | undefined {
  if (!snippet || !snippet.key) {
    return undefined;
  }

  if (snippet.key === true) {
    return {
      title: snippet.title,
      description: snippet.description,
    };
  }

  if (typeof snippet.key === 'string') {
    const title = snippet.key.trim() || snippet.title;
    return {
      title,
      description: snippet.description,
    };
  }

  const title = snippet.key.title?.trim() || snippet.title;
  const description = snippet.key.description?.trim() || snippet.description;

  return {
    title,
    description,
  };
}

export interface SeoSnippet {
  title: string;
  description?: string;
}

export function toSeoSnippet(snippet?: Snippet): SeoSnippet | undefined {
  if (!snippet || !snippet.seo) {
    return undefined;
  }

  if (snippet.seo === true) {
    return {
      title: snippet.title,
      description: snippet.description,
    };
  }

  if (typeof snippet.seo === 'string') {
    const title = snippet.seo.trim() || snippet.title;
    return {
      title,
      description: snippet.description,
    };
  }

  const title = snippet.seo.title?.trim() || snippet.title;
  const description = snippet.seo.description?.trim() || snippet.description;

  return {
    title,
    description,
  };
}

//
// Resolve
//

export interface ResolvedSnippet {
  schemaName: string;
  elementId: string;
  snippet: Snippet;
}

export const snippetHook = defineRawToProseHook(({ task: context, result }) => {
  if (!context.snippets?.enabled) {
    return;
  }

  return {
    step: ({ rawElement, proseElement }) => {
      if (rawElement.snippet && proseElement.id) {
        const resolvedSnippet: ResolvedSnippet = {
          schemaName: rawElement.schema.name,
          elementId: proseElement.id,
          snippet: rawElement.snippet as Snippet,
        };
        result.snippets.push(resolvedSnippet);
      }
    },
  };
});
