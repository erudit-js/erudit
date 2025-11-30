import type { AnySchema, ProseElement } from '@jsprose/core';

import {
    resolveElementIcon,
    type ElementIcon,
    type ElementIconRaw,
} from './icon.js';
import {
    resolveElementComponent,
    type ElementComponent,
    type ElementComponentRaw,
} from './component.js';
import {
    resolveElementLanguages,
    type ElementLanguages,
    type ElementLanguagesRaw,
    type ElementPhrases,
} from './language/element.js';

export interface AppElementDefinition<TSchema extends AnySchema> {
    schema: TSchema;
    component: ElementComponentRaw;
    languages: ElementLanguagesRaw<ElementPhrases>;
    icon?: ElementIconRaw;
    createStorage?: (
        proseElement: ProseElement<TSchema>,
    ) => Promise<TSchema['Storage']> | TSchema['Storage'];
}

export interface AppElement {
    schema: AnySchema;
    component: ElementComponent;
    languages: ElementLanguages<ElementPhrases>;
    icon: ElementIcon;
    createStorage?: (
        proseElement: ProseElement<AnySchema>,
    ) => Promise<any> | any;
}

export function defineEruditProseAppElement<TSchema extends AnySchema>(
    appElement: AppElementDefinition<TSchema>,
): AppElement {
    return {
        schema: appElement.schema,
        component: resolveElementComponent(appElement.component),
        languages: resolveElementLanguages(appElement.languages),
        icon: resolveElementIcon(
            appElement.schema.type === 'block',
            appElement.icon,
        ),
        createStorage: appElement.createStorage as AppElement['createStorage'],
    };
}
