import type { ContentFlags } from './flags.js';
import type { ContentDependency } from './dependencies.js';
import type { ContentType } from './type.js';
import type { ContentExternalItem } from './externals.js';
import type { ContentSeo } from './seo.js';

export type ContentItem = { type: ContentType } & Partial<{
    title: string;
    navTitle: string;
    description: string;

    /**
     * Hidden content items do not appear in aside content navigation
     * but are still accessible via direct URL.
     */
    hidden: boolean;

    /**
     * Mark content with specific flags.
     * @example
     * ```ts
     * flags: {
     *   dev: true, // Override parent `dev` if present
     *   secondary: false, // Override parent `secondary` if present
     *   // `advanced` is not set, so it will inherit from parent if present
     * }
     * ```
     */
    flags: ContentFlags;

    /**
     * Manual list of content items this item depends on with explanations.
     * Use this to emphasize important dependencies beyond the automatic ones.
     * @example
     * ```ts
     * dependencies: [
     *   {
     *     dependency: $CONTENT.combinatorics,
     *     reason: 'Provides foundational concepts used in this topic.'
     *   },
     *   {
     *     dependency: $CONTENT.combinatorics.baseRules.product,
     *     reason: 'This topic builds upon the product rule explained in that article.'
     *   },
     * ];
     * ```
     */
    dependencies: ContentDependency[];

    /**
     * List of **important** external resources related to this content item.
     * It is not a reference list!
     * Add only resources that can provide significant additional value to the reader and relate directly to the content.
     * @example
     * ```ts
     * externals: [
     *   {
     *     type: 'physical',
     *     title: 'Combinatorial Mathematics',
     *     description: 'A comprehensive guide to combinatorial principles and applications.',
     *     reason: 'Great amount of problems to practice combinatorial concepts.'
     *   },
     * ];
     */
    externals: ContentExternalItem[];

    seo: ContentSeo;
}>;

export type TypelessContentItem<TContentItem extends ContentItem> = Omit<
    TContentItem,
    'type'
>;

// export interface ContentItem extends ContentItemBase {
//     type: ContentType;
// }

export function finalizeContentItem(
    type: ContentType,
    item: TypelessContentItem<ContentItem>,
): ContentItem {
    return {
        ...item,
        type,
    };
}

export function isContentItem<TContentItem extends ContentItem>(
    item: any,
    type: TContentItem['type'],
): item is TContentItem {
    return (
        item && typeof item === 'object' && 'type' in item && item.type === type
    );
}
