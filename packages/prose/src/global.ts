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
        },
    >(definition: TDefinition) {
        return definition;
    }

    return finalizeGlobalElement;
}

export type GlobalElementDefinition = ReturnType<
    ReturnType<typeof defineGlobalElement>
>;
