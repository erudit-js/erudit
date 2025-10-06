import {
    type AccentBlockSchema,
    type AccentSchema,
    type AccentSectionSchema,
} from './schema';
import type { AccentSectionData } from './sectionData';
import type { AccentBlockDirection } from './direction';
import { defineTag } from '../../tag';
import { defineGlobalElement } from '../../globalElement';
import type { BlockSchemaAny, ElementSchema } from '../../schema';
import { ElementType } from '../../type';
import { type JsxElement } from '../../element';
import { ProseError } from '../../error';
import {
    ensureBlockChild,
    ensureHasChildren,
    type RawChildren,
} from '../../children';

export function defineAccentGlobal<TAccentSchema extends AccentSchema>(
    accentSchema: TAccentSchema,
) {
    type _SectionSchema = AccentSectionSchema<TAccentSchema>;
    type _BlockSchema = AccentBlockSchema<TAccentSchema>;

    const sectionElementName =
        `${accentSchema.name}Section` as `${TAccentSchema['name']}Section`;

    // <NameMain>
    const mainSectionTag = defineTag(`${accentSchema.name}Main`)<
        _SectionSchema,
        { children: RawChildren }
    >({
        type: ElementType.Block,
        name: sectionElementName,
        linkable: false,
        initElement({ children, tagName, element }) {
            element.data = { type: 'main' };
            ensureHasChildren(tagName, children);
            element.children = children as JsxElement<BlockSchemaAny>[];
        },
        childStep({ tagName, child }) {
            ensureBlockChild(tagName, child);
        },
    });

    // <NameSection :title>
    const customSectionTag = defineTag(`${accentSchema.name}Section`)<
        _SectionSchema,
        { title: string; children: RawChildren }
    >({
        type: ElementType.Block,
        name: sectionElementName,
        linkable: false,
        initElement({ children, element, props, tagName }) {
            ensureHasChildren(tagName, children);
            element.children = children as JsxElement<BlockSchemaAny>[];

            if (!props.title) {
                throw new ProseError(
                    `<${tagName}> requires a title prop when not using the main section!`,
                );
            }

            element.data = { type: 'custom', title: props.title };
        },
        childStep({ tagName, child }) {
            ensureBlockChild(tagName, child);
        },
    });

    // <NameSuffix>
    const createSuffixSectionTag = (
        suffix: TAccentSchema['sectionSuffixes'][number],
    ) =>
        defineTag(`${accentSchema.name}${suffix}`)<
            _SectionSchema,
            { children: RawChildren }
        >({
            type: ElementType.Block,
            name: sectionElementName,
            linkable: false,
            initElement({ children, element, tagName }) {
                ensureHasChildren(tagName, children);
                element.children = children as JsxElement<BlockSchemaAny>[];
                element.data = {
                    type: 'suffix',
                    suffix: suffix as TAccentSchema['sectionSuffixes'][number],
                };
            },
            childStep({ tagName, child }) {
                ensureBlockChild(tagName, child);
            },
        });

    const sectionGlobalDefinition = defineGlobalElement<_SectionSchema>()({
        name: sectionElementName,
        tags: {
            [mainSectionTag.tagName]: mainSectionTag,
            [customSectionTag.tagName]: customSectionTag,
            ...Object.fromEntries(
                accentSchema.sectionSuffixes.map((suffix) => {
                    const suffixSectionTag = createSuffixSectionTag(suffix);
                    return [suffixSectionTag.tagName, suffixSectionTag];
                }),
            ),
        } as {
            [K in `${TAccentSchema['name']}Main`]: typeof mainSectionTag;
        } & {
            [K in `${TAccentSchema['name']}Section`]: typeof customSectionTag;
        } & {
            [K in `${TAccentSchema['name']}${TAccentSchema['sectionSuffixes'][number]}`]: ReturnType<
                typeof createSuffixSectionTag
            >;
        },
    });

    // <Name>
    const blockTag = defineTag(accentSchema.name)<
        _BlockSchema,
        {
            direction?: AccentBlockDirection;
            children: RawChildren;
        }
    >({
        type: ElementType.Block,
        name: accentSchema.name,
        linkable: true,
        initElement({ tagName, children, element, props }) {
            element.data = props.direction || 'column';

            ensureHasChildren(tagName, children);

            let hasMainSection = false;
            for (const child of children) {
                if (mainSectionTag.isTagElement(child)) {
                    hasMainSection = true;
                    break;
                }
            }

            if (!hasMainSection) {
                throw new ProseError(
                    `<${accentSchema.name}> requires main section child <${mainSectionTag.tagName}>!`,
                );
            }

            element.children = children as JsxElement<_SectionSchema>[];
        },
        childStep({ child, tagName }) {
            if (child.name !== `${accentSchema.name}Section`) {
                throw new ProseError(
                    `<${tagName}> can only have section children, but found <${child.tagName}>!`,
                );
            }
        },
    });

    const blockGlobalDefinition = defineGlobalElement<_BlockSchema>()({
        name: accentSchema.name as TAccentSchema['name'],
        tags: {
            [blockTag.tagName]: blockTag,
        } as { [K in TAccentSchema['name']]: typeof blockTag },
    });

    return [blockGlobalDefinition, sectionGlobalDefinition] as const;
}
