import {
    resolveRawElement,
    type AnySchema,
    type ProseElement,
} from '@jsprose/core';

import type { EruditRawElement } from './rawElement.js';
import type { EruditProseContext } from './context.js';
import { snippetStep, type ResolvedSnippet } from './snippet.js';
import { tocItemStep, type ResolvedTocItem } from './toc.js';
import { slugify } from './slugify/index.js';
import type { ResolveStep } from './resolveStep.js';
import { imageSrcStep } from './elements/image/core.js';
import { videoSrcStep } from './elements/video/core.js';
import { calloutIconSrcStep } from './elements/callout/core.js';
import { problemScriptStep } from './elements/problem/step.js';
import { dependencyStep } from './elements/link/dependency/core.js';

export async function resolveEruditRawElement(args: {
    context: EruditProseContext;
    rawElement: EruditRawElement<AnySchema>;
    step?: ResolveStep;
}): Promise<
    Awaited<ReturnType<typeof resolveRawElement>> & ResolvedEruditRawElement
> {
    const { context, rawElement, step } = args;

    const snippets: ResolvedSnippet[] = [];
    const tocItems: ResolvedTocItem[] = [];
    const dependencies: Set<string> = new Set();
    const files: Set<string> = new Set();
    const problemScripts: Set<string> = new Set();
    const uniqueTitles: Record<string, string> = {};

    const _step: ResolveStep = async (args) => {
        const snippet = snippetStep(args);
        if (snippet) snippets.push(snippet);

        const tocItem = tocItemStep(args);
        if (tocItem) tocItems.push(tocItem);

        const resolvedDependency = dependencyStep(args);
        if (resolvedDependency) dependencies.add(resolvedDependency);

        const imageSrc = imageSrcStep(args);
        if (imageSrc && !files.has(imageSrc)) files.add(imageSrc);

        const videoSrc = videoSrcStep(args);
        if (videoSrc && !files.has(videoSrc)) files.add(videoSrc);

        const calloutIconSrc = calloutIconSrcStep(args);
        if (calloutIconSrc && !files.has(calloutIconSrc))
            files.add(calloutIconSrc);

        const problemScript = problemScriptStep(args);
        if (problemScript && !problemScripts.has(problemScript))
            problemScripts.add(problemScript);

        if (args.rawElement.title && args.rawElement.uniqueName) {
            uniqueTitles[args.rawElement.uniqueName] = args.rawElement.title;
        }

        if (step) {
            await step(args);
        }
    };

    const baseResolveResult = await resolveRawElement({
        rawElement,
        linkable: context.linkable,
        pre: async (rawElement) => {
            if (rawElement.slug) {
                rawElement.slug = await slugify(
                    rawElement.slug,
                    context.language,
                );
            }
        },
        step: ({ rawElement, proseElement }) => {
            _step({ context, rawElement, proseElement });
        },
    });

    return {
        ...baseResolveResult,
        snippets,
        tocItems,
        dependencies,
        files,
        problemScripts,
        uniqueTitles,
    };
}

export interface ResolvedEruditRawElement {
    proseElement: ProseElement<AnySchema>;
    snippets: ResolvedSnippet[];
    tocItems: ResolvedTocItem[];
    dependencies: Set<string>;
    files: Set<string>;
    problemScripts: Set<string>;
    uniqueTitles: Record<string, string>;
}
