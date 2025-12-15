import {
    defineRegistryItem,
    defineSchema,
    ensureTagChildren,
    isRawElement,
    ProseError,
    type AnySchema,
    type BlockSchema,
    type ProseElement,
    type TagChildren,
} from '@jsprose/core';

import { defineEruditTag } from '../../tag.js';
import { uppercaseFirst, type UppercaseFirst } from '../../utils/case.js';
import { tryParagraphWrap } from '../../shared/paragraphWrap.js';

function validateTitle(tagName: string, title: string) {
    if (!title) {
        throw new ProseError(
            `<${tagName}> requires non-empty title attribute!`,
        );
    }
}

export interface AccentDefinition<
    TName extends string,
    TSectionNames extends readonly string[],
> {
    name: TName;
    sectionNames: TSectionNames;
}

export type AccentMainSchema = Omit<BlockSchema, 'Data' | 'linkable'> & {
    linkable: false;
    Data: undefined;
};
export type AccentSectionSchema = Omit<BlockSchema, 'Data' | 'linkable'> & {
    linkable: false;
    Data: { type: 'named'; name: string } | { type: 'manual'; title: string };
};
export type AccentSchema = Omit<
    BlockSchema,
    'Data' | 'Children' | 'linkable'
> & {
    linkable: true;
    Data: { title: string; layout: 'column' | 'row' };
    Children: (AccentMainSchema | AccentSectionSchema)[];
    SectionNames: string[];
};

export function isAccentElement(
    element: ProseElement<AnySchema>,
): element is ProseElement<AccentSchema> {
    return element.schemaName.startsWith('accent_');
}

export function isAccentMainElement(
    element: ProseElement<AnySchema>,
): element is ProseElement<AccentMainSchema> {
    return element.schemaName.startsWith('accentMain_');
}

export function isAccentSectionElement(
    element: ProseElement<AnySchema>,
): element is ProseElement<AccentSectionSchema> {
    return element.schemaName.startsWith('accentSection_');
}

export function defineAccentCore<
    const I extends string,
    const J extends string[],
    const TDefinition extends AccentDefinition<I, J>,
>(definition: TDefinition) {
    // Accent name must start with lowercase
    if (!/^[a-z]/.test(definition.name)) {
        throw new ProseError(
            `
Invalid accent name "${definition.name}"!
Accent names should start with lower case letter.
            `.trim(),
        );
    }

    for (const sectionName of definition.sectionNames) {
        if (sectionName === 'section' || sectionName === 'main') {
            throw new ProseError(
                `Section names "section" and "main" are reserved for accent "${definition.name}"!`,
            );
        }

        // Section name must start with lowercase
        if (!/^[a-z]/.test(sectionName)) {
            throw new ProseError(
                `
Invalid section name "${sectionName}" for accent "${definition.name}"!
Section names should start with lower case letter.
                `.trim(),
            );
        }
    }

    //
    // Schemas
    //

    const mainSchema = defineSchema({
        name: `accentMain_${definition.name}` as `accentMain_${TDefinition['name']}`,
        type: 'block',
        linkable: false,
    })<{
        Data: undefined;
        Storage: undefined;
        Children: AnySchema[];
    }>();

    const sectionSchema = defineSchema({
        name: `accentSection_${definition.name}` as `accentSection_${TDefinition['name']}`,
        type: 'block',
        linkable: false,
    })<{
        Data:
            | { type: 'named'; name: string }
            | { type: 'manual'; title: string };
        Storage: undefined;
        Children: AnySchema[];
    }>();

    const accentSchema = defineSchema({
        name: `accent_${definition.name}` as `accent_${TDefinition['name']}`,
        type: 'block',
        linkable: true,
    })<{
        Data: { title: string; layout: 'column' | 'row' };
        Storage: undefined;
        Children: [typeof mainSchema, ...(typeof sectionSchema)[]];
    }>();

    const typedAccentSchema = accentSchema as typeof accentSchema & {
        SectionNames: TDefinition['sectionNames'];
    };

    //
    // Tags
    //

    const mainTag = defineEruditTag({
        tagName:
            `${uppercaseFirst(definition.name)}Main` as `${UppercaseFirst<TDefinition['name']>}Main`,
        schema: mainSchema,
    })<TagChildren>(({ tagName, element, children }) => {
        ensureTagChildren(tagName, children);
        element.children = children;

        const paragraphWrap = tryParagraphWrap(children);
        if (paragraphWrap) {
            element.children = paragraphWrap;
        }
    });

    const sectionTag = defineEruditTag({
        tagName:
            `${uppercaseFirst(definition.name)}Section` as `${UppercaseFirst<TDefinition['name']>}Section`,
        schema: sectionSchema,
    })<{ title: string } & TagChildren>(({
        tagName,
        element,
        props,
        children,
    }) => {
        ensureTagChildren(tagName, children);
        element.children = children;

        const paragraphWrap = tryParagraphWrap(children);
        if (paragraphWrap) {
            element.children = paragraphWrap;
        }

        const title = props.title.trim();
        validateTitle(tagName, title);

        element.data = { type: 'manual', title };
    });

    function createSuffixSectionTag<const TSuffix extends string>(
        suffix: TSuffix,
    ) {
        return defineEruditTag({
            tagName:
                `${uppercaseFirst(definition.name)}${uppercaseFirst(suffix)}` as `${UppercaseFirst<TDefinition['name']>}${UppercaseFirst<TSuffix>}`,
            schema: sectionSchema,
        })<TagChildren>(({ tagName, element, children }) => {
            ensureTagChildren(tagName, children);
            element.children = children;

            const paragraphWrap = tryParagraphWrap(children);
            if (paragraphWrap) {
                element.children = paragraphWrap;
            }

            element.data = { type: 'named', name: suffix };
        });
    }

    const namedSectionTags = Object.fromEntries(
        definition.sectionNames.map((sectionName) => {
            const sectionTag = createSuffixSectionTag(sectionName);
            return [sectionName, sectionTag];
        }),
    ) as {
        [K in TDefinition['sectionNames'][number]]: ReturnType<
            typeof createSuffixSectionTag<K>
        >;
    };

    const sectionTags = [sectionTag, ...Object.values(namedSectionTags)] as [
        typeof sectionTag,
        ...(typeof namedSectionTags)[TDefinition['sectionNames'][number]][],
    ];

    const accentTag = defineEruditTag({
        tagName:
            `${uppercaseFirst(definition.name)}` as `${UppercaseFirst<TDefinition['name']>}`,
        schema: typedAccentSchema,
    })<
        { title: string } & (
            | { row?: true; column?: undefined }
            | { row?: undefined; column?: true }
        ) &
            TagChildren
    >(({ tagName, children, element, props }) => {
        ensureTagChildren(tagName, children, [mainSchema, sectionSchema]);
        element.children = children as any;

        if (!isRawElement(element.children[0], mainSchema)) {
            throw new ProseError(
                `<${tagName}> requires a <${mainTag.tagName}> as the first child element!`,
            );
        }

        const title = props.title.trim();
        validateTitle(tagName, title);

        let layout: 'column' | 'row' = 'column';
        if (props.row === true) {
            layout = 'row';
        }

        element.data = { title, layout };
        element.title = title;
    });

    //
    // Registry Items
    //

    const mainRegistryItem = defineRegistryItem({
        schema: mainSchema,
        tags: [mainTag],
    });

    const sectionRegistryItem = defineRegistryItem({
        schema: sectionSchema,
        tags: [
            sectionTag,
            ...(Object.values(namedSectionTags) as any),
        ] as typeof sectionTags,
    });

    const accentRegistryItem = defineRegistryItem({
        schema: typedAccentSchema,
        tags: [accentTag],
    });

    //
    // Return
    //

    return {
        _sectionNames: definition.sectionNames as TDefinition['sectionNames'],
        accent: {
            schema: typedAccentSchema,
            tag: accentTag,
            registryItem: accentRegistryItem,
        },
        main: {
            schema: mainSchema,
            tag: mainTag,
            registryItem: mainRegistryItem,
        },
        section: {
            schema: sectionSchema,
            tags: sectionTags,
            registryItem: sectionRegistryItem,
        },
    };
}
