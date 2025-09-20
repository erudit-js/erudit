import type { ElementSchemaAny } from '../schema';
import { resolveElementComponent, type ElementComponentRaw } from './component';
import type { ElementIconRaw } from './icon';
import { resolveElementIcon } from './icon';
import { resolveElementLanguages, type ElementLanguagesRaw } from './language';

export * from './component';
export * from './icon';
export * from './language';

export function defineAppElement<TSchema extends ElementSchemaAny>(definition: {
    type: TSchema['Type'];
    name: TSchema['Name'];
    icon?: ElementIconRaw;
    component: ElementComponentRaw;
    languages: ElementLanguagesRaw<any>;
    createStorageData?: (
        element: TSchema,
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
