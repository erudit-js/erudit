interface BaseContentExternal {
    type: 'web' | 'physical';
    title: string;
    reason: string;
    info?: string;
    link?: string;
}

export interface WebContentExternal extends BaseContentExternal {
    type: 'web';
}

export interface PhysicalContentExternal extends BaseContentExternal {
    type: 'physical';
}

export type ContentExternalItem = WebContentExternal | PhysicalContentExternal;

export interface ContentExternalOwnGroup {
    type: 'own';
    items: ContentExternalItem[];
}

export interface ContentExternalParentGroup {
    type: 'parent';
    title: string;
    items: ContentExternalItem[];
}

export type ContentExternalGroup =
    | ContentExternalOwnGroup
    | ContentExternalParentGroup;

export type ContentExternals = ContentExternalGroup[];
