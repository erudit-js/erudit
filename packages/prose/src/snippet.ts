import { ProseError, type AnySchema, type ProseElement } from '@jsprose/core';

import type { EruditProcessTagArgs } from './tag.js';
import { defineResolveStep } from './resolveStep.js';
import type { EruditRawElement } from './rawElement.js';

interface SnippetBase {
    title?: string;
    description?: string;
}

interface SnippetSearch {
    /**
     * Show element in search results.
     */
    search?:
        | boolean
        | {
              synonyms?: string[];
          };
}

interface SnippetQuick {
    /**
     * Show element in "Quick Links" sections at start of the page and also in TOC.
     */
    quick?: boolean;
}

export type Snippet = SnippetBase & SnippetQuick & SnippetSearch;
export type ObjPropSnippet = {
    /**
     * Compact summary of the element to use in other places (e.g., search results, quick links, TOC).
     */
    snippet?: Snippet;
};
export type ObjRawElementSnippet = { snippet?: Snippet };

export function finalizeSnippet(
    processTagArgs: EruditProcessTagArgs,
): Snippet | undefined {
    const propSnippet = processTagArgs.props.snippet || {};
    const elementSnippet = processTagArgs.element.snippet || {};

    const quick = finalizeQuick(propSnippet, elementSnippet);
    const search = finalizeSearch(propSnippet, elementSnippet);

    if ([quick, search].every((v) => Boolean(v) === false)) {
        return undefined;
    }

    const title = finalizeTitle(processTagArgs);
    const description = finalizeDescription(propSnippet, elementSnippet);

    const snippet: Snippet = {
        title,
    };

    if (quick) {
        snippet.quick = quick;
    }

    if (search) {
        snippet.search = search;
    }

    if (description) {
        snippet.description = description;
    }

    return snippet;
}

function finalizeQuick(
    propSnippet: Snippet,
    elementSnippet: Snippet,
): Snippet['quick'] {
    if (propSnippet.quick === undefined) {
        return elementSnippet.quick;
    }

    return propSnippet.quick;
}

function finalizeSearch(
    propSnippet: Snippet,
    elementSnippet: Snippet,
): Snippet['search'] {
    if (propSnippet.search === undefined) {
        return elementSnippet.search;
    }

    return propSnippet.search;
}

function finalizeTitle(processTagArgs: EruditProcessTagArgs): string {
    const title =
        processTagArgs.props.snippet?.title?.trim() ||
        processTagArgs.element.snippet?.title?.trim() ||
        processTagArgs.element.title?.trim();

    if (!title) {
        throw new ProseError(`Unable to finalize snippet title!`);
    }

    return title;
}

function finalizeDescription(
    propSnippet: Snippet,
    elementSnippet: Snippet,
): string | undefined {
    return (propSnippet.description || elementSnippet.description)?.trim();
}

//
// Resolve
//

export interface ResolvedSnippet extends Snippet {
    schemaName: string;
    isUnique: boolean;
    elementId: string;
}

export const snippetStep = defineResolveStep(({ rawElement, proseElement }) => {
    if (rawElement.snippet && proseElement.id) {
        const resolvedSnippet: ResolvedSnippet = {
            ...rawElement.snippet,
            schemaName: rawElement.schemaName,
            isUnique: Boolean(rawElement.uniqueName),
            elementId: proseElement.id,
        };

        return resolvedSnippet;
    }
});
