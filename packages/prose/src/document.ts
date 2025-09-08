import { Blocks, type ProseBlocks } from './default';
import { isTagElement, type ProseTag } from './tag';
import { ProseError } from './error';
import { defineRef, type ProseRef, type TagsToRefs } from './ref';
import type { ProseElementAny } from './element';

export type ProseDocument<TRefs extends Record<string, any>> = {
    refs: TRefs;
    content: ProseBlocks;
};

export function defineDocument<
    TRefDefs extends Record<string, ProseTag>,
>(definition: {
    url: string;
    content: (args: { docRefs: TagsToRefs<TRefDefs> }) => ProseElementAny;
    refs?: TRefDefs;
}): ProseDocument<TagsToRefs<TRefDefs>> {
    const refDefinitions = definition.refs || ({} as TRefDefs);
    const contentFn = definition.content;

    const docRefs = {} as TagsToRefs<TRefDefs>;
    for (const [key, tag] of Object.entries(refDefinitions)) {
        (docRefs as any)[key] = defineRef({
            tag,
            slug: key,
            url: definition.url,
        });
    }

    const content = contentFn({ docRefs: docRefs });

    if (!isTagElement(content, Blocks)) {
        throw new ProseError(
            `Document content function must return a <${Blocks.name}> element!`,
        );
    }

    for (const ref of Object.values(docRefs)) {
        const typedRef = ref as ProseRef;
        const assignedElement = typedRef.element;

        if (!assignedElement) {
            throw new ProseError(
                `Reference "${typedRef.slug}" was not assigned a value in the content function!`,
            );
        }
    }

    return {
        refs: docRefs,
        content,
    };
}
