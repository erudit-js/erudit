interface BaseContentExternal {
    type: 'web' | 'physical';
    title: string;
    info?: string;
    reason: string;
}

export interface WebContentExternal extends BaseContentExternal {
    type: 'web';
    link: string;
}

export interface PhysicalContentExternal extends BaseContentExternal {
    type: 'physical';
}

export type ContentExternal = WebContentExternal | PhysicalContentExternal;
