import type { ElementType } from './type';

export type ElementSchema<
    TType extends ElementType,
    TName extends string,
    TData extends any,
    TStorage extends any,
    TChildren extends ElementSchema<any, any, any, any, any>[] | undefined,
> = {
    Type: TType;
    Name: TName;
    Data: TData;
    Storage: TStorage;
    Children: TChildren;
};

export type ElementSchemaAny = ElementSchema<
    ElementType,
    string,
    any,
    any,
    any
>;

export type BlockSchemaAny = ElementSchema<
    ElementType.Block,
    string,
    any,
    any,
    any
>;

export type InlinerSchemaAny = ElementSchema<
    ElementType.Inliner,
    string,
    any,
    any,
    InlinerSchemaAny[] | undefined
>;
