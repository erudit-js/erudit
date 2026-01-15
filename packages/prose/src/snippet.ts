import { ProseError, type AnySchema, type ProseElement } from '@jsprose/core';

import type { EruditProcessTagArgs } from './tag.js';
import { defineResolveStep } from './resolveStep.js';
import type { EruditRawElement } from './rawElement.js';

/**
 * Snippet attribute - only contains title and description
 */
export interface SnippetProp {
    title?: string;
    description?: string;
}

export type ObjPropSnippet = {
    /**
     * Compact summary of the element with title and description.
     */
    snippet?: SnippetProp;
};

export type ObjPropSearch = {
    /**
     * Show element in search results.
     * Can be a boolean to enable/disable, or an object with synonyms.
     */
    search?: boolean | { synonyms: string[] };
};

export type ObjPropQuick = {
    /**
     * Show element in "Quick Links" sections at start of the page and also in TOC.
     */
    quick?: boolean;
};

export type ObjPropSeo = {
    /**
     * When targeting this element with '#' anchor, adjust SEO metadata (like title and description).
     * Search engines should treat it as a different "page" and therefore show it as a standalone search result.
     */
    seo?: boolean;
};

export type ObjRawElementSnippet = {
    snippet?: SnippetProp;
    snippetFlags?: {
        quick?: boolean;
        search?: boolean | { synonyms: string[] };
        seo?: boolean;
    };
};

export function finalizeSnippet(
    processTagArgs: EruditProcessTagArgs,
): SnippetProp | undefined {
    const quick =
        processTagArgs.props.quick ??
        processTagArgs.element.snippetFlags?.quick;
    const search =
        processTagArgs.props.search ??
        processTagArgs.element.snippetFlags?.search;
    let seo =
        processTagArgs.props.seo ?? processTagArgs.element.snippetFlags?.seo;

    // If none of the flags are set to true, no snippet is created
    if (!quick && !search && !seo) {
        return undefined;
    }

    // Enable SEO if either quick or search is enabled unless SEO is explicitly disabled
    // Check both element defaults and props - if either explicitly disables seo, don't auto-enable
    const seoExplicitlyDisabled =
        processTagArgs.element.snippetFlags?.seo === false ||
        processTagArgs.props.seo === false;

    if (!seoExplicitlyDisabled) {
        if (quick || search) {
            seo = true;
        }
    }

    const title = finalizeTitle(processTagArgs);
    const description = finalizeDescription(processTagArgs);

    const snippet: SnippetProp = {
        title,
    };

    if (description) {
        snippet.description = description;
    }

    // Store flags on element for later resolution
    processTagArgs.element.snippetFlags = { quick, search, seo };

    return snippet;
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
    title: string;
    description?: string;
    quick?: boolean;
    search?: boolean | { synonyms: string[] };
    seo?: boolean;
    schemaName: string;
    isUnique: boolean;
    elementId: string;
}

export const snippetStep = defineResolveStep(({ rawElement, proseElement }) => {
    if (rawElement.snippet && proseElement.id && rawElement.snippet.title) {
        const resolvedSnippet: ResolvedSnippet = {
            title: rawElement.snippet.title,
            description: rawElement.snippet.description,
            quick: rawElement.snippetFlags?.quick,
            search: rawElement.snippetFlags?.search,
            seo: rawElement.snippetFlags?.seo,
            schemaName: rawElement.schemaName,
            isUnique: Boolean(rawElement.uniqueName),
            elementId: proseElement.id,
        };

        return resolvedSnippet;
    }
});
