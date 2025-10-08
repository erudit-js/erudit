import type { ParsedElement } from '../element';
import type { ElementSchemaAny } from '../schema';
import { type ElementComponentRaw, resolveElementComponent } from './component';
import { type ElementIconRaw, resolveElementIcon } from './icon';
import {
    type ElementLanguagesRaw,
    type ElementPhrases,
    resolveElementLanguages,
} from './language';

export function defineAppElement<TSchema extends ElementSchemaAny>(definition: {
    type: TSchema['Type'];
    name: TSchema['Name'];
    icon?: ElementIconRaw;
    component: ElementComponentRaw;
    languages: ElementLanguagesRaw<ElementPhrases<any>>;
    createStorageData?: (
        element: ParsedElement<TSchema>,
    ) => Promise<TSchema['Storage']> | TSchema['Storage'];
}) {
    return {
        type: definition.type,
        name: definition.name,
        icon: resolveElementIcon(definition.type, definition.icon),
        component: resolveElementComponent(definition.component),
        languages: resolveElementLanguages(definition.languages),
        createStorageData: definition.createStorageData,
    };
}

export type AppElementDefinition = ReturnType<typeof defineAppElement>;

export type AppElementDefinitions = Record<string, AppElementDefinition>;
