import {
    defineAppElement,
    type AppElementDefinition,
    type ElementIconRaw,
    type ElementLanguagesRaw,
    type ElementPhrases,
} from '../../app';
import { ElementType } from '../../type';
import type { AccentBlockSchema, AccentSchema } from './schema';

export interface AccentAppContext {
    colors: {
        text: string;
        background: string;
        border: string;
    };
}

export type AccentAppDefinition<TAccentSchema extends AccentSchema> = {
    schema: TAccentSchema;
    languages: ElementLanguagesRaw<
        ElementPhrases<{
            [K in `section_title_${TAccentSchema['sectionSuffixes'][number]}`]: string;
        }>
    >;
    icon?: ElementIconRaw;
    context: AccentAppContext;
};

export function getAccentContext(appElement: AppElementDefinition) {
    return (appElement as any).accentContext as AccentAppContext;
}

export function defineAccentApp<TAccentSchema extends AccentSchema>(
    definition: AccentAppDefinition<TAccentSchema>,
) {
    const appDefinition = defineAppElement<AccentBlockSchema<TAccentSchema>>({
        type: ElementType.Block,
        name: definition.schema.name,
        icon: definition.icon,
        languages: definition.languages,
        component: () => import('./AccentBlock.vue'),
    });

    return {
        ...appDefinition,
        accentContext: definition.context,
    };
}
