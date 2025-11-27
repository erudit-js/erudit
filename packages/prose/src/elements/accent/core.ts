import {
    defineRegistryItem,
    defineSchema,
    ensureTagChildren,
    ProseError,
    type AnySchema,
    type TagChildren,
} from '@jsprose/core';

import { defineEruditTag } from '../../tag.js';
import { uppercaseFirst, type UppercaseFirst } from '../../utils/case.js';

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

export function defineAccent<
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
        name: `${definition.name}Main` as `${TDefinition['name']}Main`,
        type: 'block',
        linkable: false,
    })<{
        Data: undefined;
        Storage: undefined;
        Children: AnySchema[];
    }>();

    const sectionSchema = defineSchema({
        name: `${definition.name}Section` as `${TDefinition['name']}Section`,
        type: 'block',
        linkable: false,
    })<{
        Data: { title: string };
        Storage: undefined;
        Children: AnySchema[];
    }>();

    const namedSectionsSchemas = Object.fromEntries(
        definition.sectionNames.map((sectionName) => {
            const schema = defineSchema({
                name: `${definition.name}${uppercaseFirst(sectionName)}` as `${TDefinition['name']}${UppercaseFirst<typeof sectionName>}`,
                type: 'block',
                linkable: false,
            })<{
                Data: { name: typeof sectionName };
                Storage: undefined;
                Children: AnySchema[];
            }>();

            return [sectionName, { schema }];
        }),
    ) as {
        [K in TDefinition['sectionNames'][number]]: {
            schema: {
                name: `${TDefinition['name']}${UppercaseFirst<K>}`;
                type: 'block';
                linkable: false;
                Data: { name: K };
                Storage: undefined;
                Children: AnySchema[];
            };
        };
    };

    const accentSchema = defineSchema({
        name: definition.name as TDefinition['name'],
        type: 'block',
        linkable: true,
    })<{
        Data: { title: string };
        Storage: undefined;
        Children: [
            typeof mainSchema,
            ...(
                | {
                      [K in number]: (typeof namedSectionsSchemas)[TDefinition['sectionNames'][K]]['schema'];
                  }[number]
                | typeof sectionSchema
            )[],
        ];
    }>();

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

        const title = props.title.trim();
        validateTitle(tagName, title);

        element.data = { title };
    });

    function createSuffixSectionTag<const TSuffix extends string>(
        suffix: TSuffix,
    ) {
        return defineEruditTag({
            tagName:
                `${uppercaseFirst(definition.name)}${uppercaseFirst(suffix)}` as `${UppercaseFirst<TDefinition['name']>}${UppercaseFirst<TSuffix>}`,
            schema: namedSectionsSchemas[
                suffix as TDefinition['sectionNames'][number]
            ].schema,
        })<TagChildren>(({ tagName, element, children }) => {
            ensureTagChildren(tagName, children);
            element.children = children;
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

    const accentTag = defineEruditTag({
        tagName:
            `${uppercaseFirst(definition.name)}` as `${UppercaseFirst<TDefinition['name']>}`,
        schema: accentSchema,
    })<{ title: string } & TagChildren>(({
        tagName,
        children,
        element,
        props,
    }) => {
        ensureTagChildren(tagName, children, [
            mainSchema,
            sectionSchema,
            ...Object.values(namedSectionsSchemas).map((v: any) => v.schema),
        ]);
        element.children = children as any;

        const title = props.title.trim();
        validateTitle(tagName, title);

        element.data = { title };
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
        tags: [sectionTag],
    });

    function createSuffixSectionRegistryItem<const TSuffix extends string>(
        suffix: TSuffix,
    ) {
        return defineRegistryItem({
            schema: namedSectionsSchemas[
                suffix as TDefinition['sectionNames'][number]
            ].schema,
            tags: [
                namedSectionTags[suffix as TDefinition['sectionNames'][number]],
            ],
        });
    }

    const namedRegistryItems = Object.fromEntries(
        definition.sectionNames.map((sectionName) => {
            const registryItem = createSuffixSectionRegistryItem(sectionName);
            return [sectionName, { registryItem }];
        }),
    ) as unknown as {
        [K in TDefinition['sectionNames'][number]]: {
            registryItem: ReturnType<typeof createSuffixSectionRegistryItem>;
        };
    };

    const accentRegistryItem = defineRegistryItem({
        schema: accentSchema,
        tags: [accentTag],
    });

    //
    // Return
    //

    const namedSectionsObjectFinal = Object.fromEntries(
        definition.sectionNames.map((sectionName) => {
            return [
                sectionName,
                {
                    schema: namedSectionsSchemas[
                        sectionName as TDefinition['sectionNames'][number]
                    ].schema,
                    tag: namedSectionTags[
                        sectionName as TDefinition['sectionNames'][number]
                    ],
                    registryItem:
                        namedRegistryItems[
                            sectionName as TDefinition['sectionNames'][number]
                        ].registryItem,
                },
            ];
        }),
    ) as unknown as {
        [K in TDefinition['sectionNames'][number]]: {
            schema: (typeof namedSectionsSchemas)[K]['schema'];
            tag: (typeof namedSectionTags)[K];
            registryItem: (typeof namedRegistryItems)[K]['registryItem'];
        };
    };

    return {
        _sectionNames: definition.sectionNames as TDefinition['sectionNames'],
        accent: {
            schema: accentSchema,
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
            tag: sectionTag,
            registryItem: sectionRegistryItem,
        },
        ...namedSectionsObjectFinal,
    };
}
