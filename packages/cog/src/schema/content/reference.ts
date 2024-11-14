export type ContentReferences = ContentReferenceGroup[];

export interface ContentReferenceGroup {
    source: ContentReferenceSource;
    references: ContentReferenceItem[];
}

export interface ContentReferenceItem {
    title: string;
    description?: string;
    link?: string;
}

export interface ContentReferenceSource {
    type: 'book' | 'site';
    title: string;
    id?: string;
    featured?: boolean;
    description?: string;
    link?: string;
    comment?: string;
}
