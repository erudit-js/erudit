import type { ElementType } from './type';

export type ElementSchema<
    TSchema extends {
        Type: ElementType;
        Name: string;
        Linkable: boolean;
        Data: any;
        Storage: any;
        Children: ElementSchemaAny[] | undefined;
    },
> = {
    Type: TSchema['Type'];
    Name: TSchema['Name'];
    Linkable: TSchema['Linkable'];
    Data: TSchema['Data'];
    Storage: TSchema['Storage'];
    Children: TSchema['Children'];
};

export type ElementSchemaAny = {
    Type: ElementType;
    Name: string;
    Linkable: boolean;
    Data: any;
    Storage: any;
    Children: any;
};

export type BlockSchemaAny = ElementSchema<{
    Type: ElementType.Block;
    Name: string;
    Linkable: boolean;
    Data: any;
    Storage: any;
    Children: any;
}>;

export type InlinerSchemaAny = ElementSchema<{
    Type: ElementType.Inliner;
    Name: string;
    Linkable: boolean;
    Data: any;
    Storage: any;
    Children: InlinerSchemaAny[] | undefined;
}>;

// export type ElementSchema<
//     TType extends ElementType,
//     TName extends string,
//     TLinkable extends boolean,
//     TData extends any,
//     TStorage extends any,
//     TChildren extends
//         | ElementSchema<ElementType, string, boolean, any, any, any>[]
//         | undefined,
// > = {
//     Type: TType;
//     Name: TName;
//     Linkable: TLinkable;
//     Data: TData;
//     Storage: TStorage;
//     Children: TChildren;
// };

// export type ElementSchemaAny = ElementSchema<
//     ElementType,
//     string,
//     boolean,
//     any,
//     any,
//     any
// >;

// export type BlockSchemaAny = ElementSchema<
//     ElementType.Block,
//     string,
//     boolean,
//     any,
//     any,
//     any
// >;

// export type InlinerSchemaAny = ElementSchema<
//     ElementType.Inliner,
//     string,
//     boolean,
//     any,
//     any,
//     InlinerSchemaAny[] | undefined
// >;

// //
// //
// //

// export type DefineElementSchema<
//     TSchema extends {
//         Type: ElementType;
//         Name: string;
//         Linkable: boolean;
//         Data: any;
//         Storage: any;
//         Children: ElementSchemaAny[] | undefined;
//     },
// > = ElementSchema<
//     TSchema['Type'],
//     TSchema['Name'],
//     TSchema['Linkable'],
//     TSchema['Data'],
//     TSchema['Storage'],
//     TSchema['Children']
// >;
