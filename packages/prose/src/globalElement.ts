import type { ParsedElement } from './element';
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
        return definition;
    }

    return finalizeGlobalElement;
}

export type GlobalElementDefinition = ReturnType<
    ReturnType<typeof defineGlobalElement>
>;

export type GlobalElementDefinitions = Record<string, GlobalElementDefinition>;
