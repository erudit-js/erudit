export const _children = Symbol('ProseChildren');

export enum ProseElementType {
    Block = 'block',
    Inliner = 'inliner',
}

export type ProseElement<
    TType extends ProseElementType,
    TName extends string,
    TData extends any = undefined,
    TStorageData extends any = undefined,
> = {
    readonly type: TType;
    readonly name: TName;
    readonly data: TData;
    readonly storageData?: TStorageData;
    readonly [_children]: ProseElementAny[] | undefined;
};

export type ProseBlock<
    TName extends string,
    TData extends any = undefined,
> = ProseElement<ProseElementType.Block, TName, TData>;

export type ProseInliner<
    TName extends string,
    TData extends any = undefined,
> = ProseElement<ProseElementType.Inliner, TName, TData>;

export type ProseElementAny = ProseElement<ProseElementType, string, unknown>;
export type ProseBlockAny = ProseBlock<string, unknown>;
export type ProseInlinerAny = ProseInliner<string, unknown>;

export function createProseElement<TElement extends ProseElementAny>(
    element: TElement,
): TElement {
    return element;
}

export function isBlock(element: any): element is ProseBlockAny {
    return element && element.type === ProseElementType.Block;
}

export function isInliner(element: any): element is ProseInlinerAny {
    return element && element.type === ProseElementType.Inliner;
}
