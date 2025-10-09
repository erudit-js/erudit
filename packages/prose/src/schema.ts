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
