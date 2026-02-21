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
import type { Schema, ToProseElement } from 'tsprose';

export interface ProseAppElementDefinition<TSchema extends Schema> {
  schema: TSchema;
  component: ElementComponentRaw;
  languages?: ElementLanguagesRaw<ElementPhrases>;
  icon?: ElementIconRaw;
  createStorage?: (
    proseElement: ToProseElement<TSchema>,
  ) => Promise<TSchema['Storage']> | TSchema['Storage'];
}

export interface ProseAppElement<TSchema extends Schema = Schema> {
  schema: TSchema;
  component: ElementComponent;
  languages: ElementLanguages<ElementPhrases>;
  icon: ElementIcon;
  createStorage?: (proseElement: ToProseElement<TSchema>) => Promise<any> | any;
}

export type ProseAppElements = Record<string, ProseAppElement>;

export function defineProseAppElement<TSchema extends Schema>(
  appElement: ProseAppElementDefinition<TSchema>,
): ProseAppElement<TSchema> {
  return {
    schema: appElement.schema,
    component: resolveElementComponent(appElement.component),
    languages: resolveElementLanguages(
      appElement.schema.name,
      appElement.languages,
    ),
    icon: resolveElementIcon(
      appElement.schema.type === 'block',
      appElement.icon,
    ),
    createStorage: appElement.createStorage as ProseAppElement['createStorage'],
  };
}
