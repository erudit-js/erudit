/**
 * References are used to simply mention, **not requiring knowledge of** other content inside or outside site.
 *
 * Reference types:
 * * Global Content — points to content items and uniques via `$CONTENT` global object.
 * * Unique — points to a unique element directly.
 * * Direct — points to an external URL (when possible, avoid using of these).
 *
 * @title Inliner Reference
 * @layout inliner
 * @example
 * ```tsx
 * // Global content reference
 * <P>
 *   The method we used here is somewhat similar to <Ref to={$CONTENT.combinatorics.sumRule}>Rule of Sum</Ref> in combinatorics.
 * </P>
 *
 * // Link to uniques directly
 * <P $={uniques.intro}>Intro Paragraph</P>
 * <P>
 *   If you remember, we also did this transform back in the <Ref to={uniques.intro}>introduction</Ref>.
 * </P>
 *
 * // Direct reference
 * <Ref to="https://google.com">Just Google It!</Ref>
 * ```
 */
export const Ref = '_tag_';

/**
 * Same as `<Ref>`, but as a block element which draws more attention.
 *
 * @title Block Reference
 * @layout block
 * @example
 * ```tsx
 * // Global content reference
 * <Reference to={$CONTENT.combinatorics.sumRule}>
 *   There is a similar method called Rule of Sum in combinatorics which you might want to review.
 * </Reference>
 *
 * // Link to uniques directly
 * <P $={uniques.intro}>Intro Paragraph</P>
 * <Reference to={uniques.intro}>
 *   If you remember, we also did this transform back in the introduction.
 * </Reference>
 * ```
 */
export const Reference = '_tag_';
