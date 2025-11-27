export const contentType = ['book', 'group', 'page', 'topic'] as const;

export type ContentType = (typeof contentType)[number];

export function isContentType(type: any): type is ContentType {
    return contentType.includes(type);
}

export interface ContentItem {
    /**
     * TypeScript branding to distinguish content items from other objects.
     */
    __ERUDIT_contentItem: true;

    /**
     * Unique identifier for the content item.
     */
    contentId: string;
    type: ContentType;

    /**
     * Manual list of content items this item depends on with explanations.
     * Use this to emphasize important dependencies beyond the automatic ones.
     */
    dependencies: ContentDependency[];
}

export interface ContentDependency {
    content: ContentItem;
    reason: string;
}
