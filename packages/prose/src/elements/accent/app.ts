import {
  defineEruditProseAppElement,
  type AppElement,
  type AppElementDefinition,
} from '../../app/appElement.js';
import type {
  ElementLanguagesRaw,
  ElementPhrases,
} from '../../app/language/element.js';
import type { AccentSchema } from './core.js';

export interface AccentAppOptions {
  colors: {
    text: string;
    background: string;
    border: string;
  };
}

export function accentSectionNamePhrase<TSectionName extends string>(
  sectionName: TSectionName,
): `section_title_${TSectionName}` {
  return `section_title_${sectionName}` as `section_title_${TSectionName}`;
}

export type AccentAppDefinition<TAccentSchema extends AccentSchema> = Omit<
  AppElementDefinition<TAccentSchema>,
  'component' | 'createStorage'
> & {
  schema: TAccentSchema;
  accent: AccentAppOptions;
  languages: ElementLanguagesRaw<
    ElementPhrases<{
      [K in ReturnType<
        typeof accentSectionNamePhrase<TAccentSchema['SectionNames'][number]>
      >]: string;
    }>
  >;
};

export function defineAccentApp<TAccentSchema extends AccentSchema>(
  accentApp: AccentAppDefinition<TAccentSchema>,
): AppElement<TAccentSchema> & { accent: AccentAppOptions } {
  const appElement = defineEruditProseAppElement({
    schema: accentApp.schema,
    component: () => import('./Accent.vue'),
    icon: accentApp.icon,
    languages: accentApp.languages,
  });

  return {
    ...appElement,
    accent: accentApp.accent,
  };
}
