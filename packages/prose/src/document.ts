import { Blocks, type BlocksSchema } from './default/blocks';
import type { JsxElement } from './element';
import { ProseError } from './error';
import type { ElementSchemaAny } from './schema';
import type { ElementTagAny } from './tag';
import {
    defineUnique,
    type ElementUnique,
    type ElementUniqueAny,
} from './unique';

type TagsToUniques<TTags extends Record<string, ElementTagAny>> = {
    [K in keyof TTags]: ElementUnique<TTags[K]>;
};

export type Document<TUniques extends Record<string, ElementUniqueAny>> = {
    url: string;
    uniques: TUniques;
    content: JsxElement<BlocksSchema>;
};

export type DocumentAny = Document<Record<string, ElementUniqueAny>>;

export function createProseDocument<
    TUniqueDefs extends Record<string, ElementTagAny>,
>(definition: {
    /** The location of document module. Normally you pass `import.meta.url` here. */
    url: string;
    /** Important and/or reusable elements. */
    uniques?: TUniqueDefs;
}) {
    const url = normalizeUrl(definition.url);
    const uniqueDefs = definition.uniques || ({} as TUniqueDefs);

    const docUniques = {} as TagsToUniques<TUniqueDefs>;
    for (const [key, tag] of Object.entries(uniqueDefs)) {
        (docUniques as any)[key] = defineUnique({
            tag,
            slug: key,
            url,
        });
    }

    return (
        contentFn: (args: {
            uniques: TagsToUniques<TUniqueDefs>;
        }) => JsxElement<ElementSchemaAny>,
    ): Document<TagsToUniques<TUniqueDefs>> => {
        const content = contentFn({ uniques: docUniques });

        if (!Blocks.isTagElement(content)) {
            throw new ProseError(
                `Document content function must return a <${Blocks.name}> element!`,
            );
        }

        for (const unique of Object.values(docUniques)) {
            const typedUnique = unique as ElementUniqueAny;
            const assignedElement = typedUnique.element;

            if (!assignedElement) {
                throw new ProseError(
                    `Unique "${typedUnique.slug}" was not assigned in the content function!`,
                );
            }
        }

        return {
            url,
            uniques: docUniques,
            content,
        };
    };
}

function normalizeUrl(url: string) {
    let filePath = url;

    // Convert import.meta.url to file path
    filePath = url.startsWith('file:///') ? url.slice(8) : url;

    // Remove .jsx/.tsx extensions
    filePath = filePath.replace(/\.(jsx|tsx)$/, '');

    return filePath;
}
