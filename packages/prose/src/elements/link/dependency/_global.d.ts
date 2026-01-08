/**
 * Dependencies are used to reference content the reader **must know and understand** in order to proceed further.
 *
 * Never use dependencies to simply mention other content; for that, use `<Ref>` and `<Reference>` tags.
 *
 * Dependency types:
 * * Global Content — points to content items and uniques via `$CONTENT` global object.
 * * Unique — points to a unique element directly.
 *
 * @title Inliner Dependency
 * @layout inliner
 * @example
 * ```tsx
 * // Global content dependency
 * <P>
 *   We need to use <Dep to={$CONTENT.combinatorics.sumRule}>Rule of Sum</Dep> to calculate the answer.
 * </P>
 *
 * // Link to uniques directly
 * <P $={uniques.intro}>Intro Paragraph</P>
 * <P>
 *   We need to use <Dep to={uniques.intro}>introduction</Dep> to understand this transform.
 * </P>
 * ```
 */
export const Dep = '_tag_';

/**
 * Same as `<Dep>`, but as a block element which draws more attention.
 *
 * @title Block Dependency
 * @layout block
 * @example
 * ```tsx
 * // Global content dependency
 * <Dependency to={$CONTENT.combinatorics.sumRule}>
 *   To proceed, you must understand the Rule of Sum in combinatorics.
 * </Dependency>
 *
 * // Link to uniques directly
 * <P $={uniques.intro}>Intro Paragraph</P>
 * <Dependency to={uniques.intro}>
 *   To proceed, you must read the introduction.
 * </Dependency>
 * ```
 */
export const Dependency = '_tag_';
