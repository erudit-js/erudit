import type { AccentBlockData, AccentSectionData } from './data';
import type { BlockSchemaAny, ElementSchema } from '../../schema';
import { ProseError } from '../../error';
import type { ElementType } from '../../type';

export interface AccentSchema<
    TName extends string = string,
    TSuffixes extends string[] = string[],
> {
    name: TName;
    sectionSuffixes: TSuffixes;
}

export function defineAccentSchema<TName extends string>(name: TName) {
    return <TSuffixes extends string[]>(
        ...sectionSuffixes: TSuffixes
    ): AccentSchema<TName, TSuffixes> => {
        if (
            sectionSuffixes.includes('Main') ||
            sectionSuffixes.includes('Section')
        ) {
            throw new ProseError(
                `Accent schema section suffixes cannot include "Main" or "Section" as they are reserved!`,
            );
        }

        return { name, sectionSuffixes };
    };
}

export type AccentSectionSchema<TAccentSchema extends AccentSchema> =
    ElementSchema<{
        Type: ElementType.Block;
        Name: `${TAccentSchema['name']}Section`;
        Linkable: false;
        Data: AccentSectionData;
        Storage: undefined;
        Children: BlockSchemaAny[];
    }>;

export type AccentBlockSchema<TAccentSchema extends AccentSchema> =
    ElementSchema<{
        Type: ElementType.Block;
        Name: TAccentSchema['name'];
        Linkable: true;
        Data: AccentBlockData;
        Storage: undefined;
        Children: AccentSectionSchema<TAccentSchema>[];
    }>;
