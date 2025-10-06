import type { ParsedElement } from './element';
import { ProseError } from './error';
import type { ElementSchemaAny } from './schema';
import type { ElementTag } from './tag';

export function defineGlobalElement<TSchema extends ElementSchemaAny>() {
    function finalizeGlobalElement<
        TDefinition extends {
            name: TSchema['Name'];
            tags?: Record<string, ElementTag<TSchema, string, any>>;
            dependencies?: Record<
                string,
                { transpile?: true; optimize?: true }
            >;
            createStorageData?: (
                element: ParsedElement<TSchema>,
            ) => Promise<TSchema['Storage']> | TSchema['Storage'];
        },
    >(definition: TDefinition) {
        // for (const outerTagName in definition.tags) {
        //     const tag = definition.tags[outerTagName];
        //     if (outerTagName !== tag.tagName) {
        //         throw new ProseError(
        //             `Global element "${definition.name}" has a tag with mismatched name: expected "${outerTagName}", but got "${tag.tagName}"!`,
        //         );
        //     }
        // }

        return definition;
    }

    return finalizeGlobalElement;
}

export type GlobalElementDefinition = ReturnType<
    ReturnType<typeof defineGlobalElement>
>;

export type GlobalElementDefinitions = Record<string, GlobalElementDefinition>;
