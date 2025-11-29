import type { VirtualContributors } from '../contributor.js';
import type { ContentDependency } from './dependency.js';
import type { ContentFlags } from './flags.js';

export type ContentItemBrand = {
    __ERUDIT_contentItem: true;
};

export type ContentItemBase = Partial<{
    itemId: string;
    title: string;
    navTitle: string;
    description: string;

    /**
     * Hidden content items do not appear in aside content navigation
     * but are still accessible via direct URL.
     */
    hidden: boolean;

    /**
     * You can access virtual contributors via `#contributors` virtual module:
     * ```ts
     * import { fooContributor, barContributor } from '#contributors';
     *
     * contributors: {
     *   fooContributor,
     *   barContributor,
     * },
     * ```
     */
    contributors: VirtualContributors;

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
     * import combinatoricsBook from '1-combinatorics/book';
     * import productRuleArticle from '1-combinatorics/2-product-rule/article';
     *
     * dependencies: [
     *   {
     *     dependency: combinatoricsBook,
     *     reason: 'Provides foundational concepts used in this topic.'
     *   },
     *   {
     *     dependency: productRuleArticle,
     *     reason: 'This topic builds upon the product rule explained in that article.'
     *   },
     * ];
     * ```
     */
    dependencies: ContentDependency[];
}>;

export type ContentItem<T = {}> = ContentItemBrand & ContentItemBase & T;

export type ContentItemArg<T = {}> = ContentItemBase & T;

export function finalizeContentItem(data: ContentItemArg): ContentItem {
    return {
        __ERUDIT_contentItem: true,
        ...data,
    };
}
