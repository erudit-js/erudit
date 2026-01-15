import { ProseError, type AnySchema, type ProseElement } from '@jsprose/core';

import type { EruditProcessTagArgs } from './tag.js';
import { headingSchema } from './elements/heading/core.js';
import { defineResolveStep } from './resolveStep.js';
import type { EruditRawElement } from './rawElement.js';

export type Toc = {
    title?: string;
    add?: boolean;
};

export type ObjPropToc = {
    /** Show element in the table of contents */
    toc?: boolean | string;
};

export type ObjRawElementToc = {
    toc?: Toc;
};

export function finalizeToc(
    processTagArgs: EruditProcessTagArgs,
): Toc | undefined {
    const propToc = processTagArgs.props.toc;

    if (propToc === false) {
        return undefined;
    }

    if (propToc === true) {
        const title = finalizeTocTitle(processTagArgs);
        return { title };
    }

    if (typeof propToc === 'string') {
        const manualTocTitle = finalizeTocTitle(processTagArgs);
        return { title: manualTocTitle };
    }

    if (processTagArgs.element.toc) {
        if (processTagArgs.element.toc.add) {
            const tocTitle = finalizeTocTitle(processTagArgs);
            return { title: tocTitle };
        }
    }
}

function finalizeTocTitle(
    processTagArgs: EruditProcessTagArgs,
): string | undefined {
    const title =
        (typeof processTagArgs.props.toc === 'string'
            ? processTagArgs.props.toc.trim()
            : '') ||
        processTagArgs.element.toc?.title?.trim() ||
        processTagArgs.element.title?.trim();

    if (title) {
        return title;
    }

    throw new ProseError('Unable to finalize TOC title!');
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

export const tocItemStep = defineResolveStep(({ rawElement, proseElement }) => {
    if (rawElement.toc?.title && proseElement.id) {
        if (rawElement.schemaName === headingSchema.name) {
            const tocItem: ResolvedTocHeading = {
                type: 'heading',
                level: rawElement.data.level,
                title: rawElement.toc.title,
                elementId: proseElement.id,
                children: [],
            };
            return tocItem;
        } else {
            const tocItem: ResolvedTocElement = {
                type: 'element',
                schemaName: rawElement.schemaName,
                title: rawElement.toc.title,
                elementId: proseElement.id,
            };
            return tocItem;
        }
    }
});
