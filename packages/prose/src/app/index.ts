import { type ProseElementAny } from '../element';
import { resolveElementComponent, type ElementComponentRaw } from './component';
import type { ElementIconRaw } from './icon';
import { resolveElementIcon } from './icon';
import { resolveElementLanguages, type ElementLanguagesRaw } from './language';

export * from './component';
export * from './icon';
export * from './language';

export function defineAppElement<TElement extends ProseElementAny>(definition: {
    type: TElement['type'];
    name: TElement['name'];
    icon?: ElementIconRaw;
    component: ElementComponentRaw;
    languages: ElementLanguagesRaw<any>;
    createStorageData?: (
        element: TElement,
    ) => Promise<TElement['storageData']> | TElement['storageData'];
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
