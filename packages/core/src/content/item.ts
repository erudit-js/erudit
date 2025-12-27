import type { ContentFlags } from './flags.js';
import type { ContentDependency } from './dependencies.js';
import type { ContentType } from './type.js';

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
     * List of contributors to this content item.
     * You can access contributors via `$CONTRIBUTOR` global variable:
     * ```ts
     * contributors: [
     *   $CONTRIBUTOR.fooContributor,
     *   $CONTRIBUTOR.barContributor,
     * ],
     * ```
     */
    contributors: string[];

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
     *     dependency: $LINK.combinatorics,
     *     reason: 'Provides foundational concepts used in this topic.'
     *   },
     *   {
     *     dependency: $LINK.combinatorics.baseRules.product.$productRule,
     *     reason: 'This topic builds upon the product rule explained in that article.'
     *   },
     * ];
     * ```
     */
    dependencies: ContentDependency[];
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
