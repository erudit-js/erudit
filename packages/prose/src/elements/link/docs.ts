/**
 * Links are used to reference other content inside or outside the current document.
 *
 * Link types:
 * * Document — points to another prose content document.
 * * Unique — points to a unique element inside another prose content document.
 * * Direct — points to an external URL (avoid using these, prefer content sources system).
 *
 * @title Link
 * @layout inliner
 * @example
 * ```tsx
 * // Link to unique inside the same document
 * <P $={uniques.intro}>Intro Paragraph</P>
 * <P>
 *   We did this transform back in the <A to={uniques.intro}>introduction</A>.
 * </P>
 *
 * // import documentFoo from '...';
 * <A to={documentFoo.uniques.theoremFoo}>Link to theorem Foo in another document</A>
 *
 * // import documentBar from '...';
 * <A to={documentBar}>Link to another document</A>
 *
 * // Direct link
 * <A to="https://google.com">Just Google It!</A>
 * ```
 */
let A;

/**
 * Block links are the block-level version of `<A>` links.
 * The only difference is that they can't be direct.
 *
 * @title Block Link
 * @layout block
 * @example
 * ```tsx
 * // Link to unique inside the same document
 * <P $={uniques.intro}>Intro Paragraph</P>
 * <BlockLink to={uniques.intro}>
 *   We did this transform back in the introduction.
 * </BlockLink>
 *
 * // import documentFoo from '...';
 * <BlockLink to={documentFoo.uniques.theoremFoo}>
 *   Link to theorem Foo in another document
 * </BlockLink>
 *
 * // import documentBar from '...';
 * <BlockLink to={documentBar}>
 *   Link to another document
 * </BlockLink>
 * ```
 */
let BlockLink;
