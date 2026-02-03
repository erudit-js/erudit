/**
 * Details are used to hide additional explanations or secondary content.
 * Default title "Details" can be changed via `title` prop.
 *
 * Clicking on a link to the details block will show it in preview area.
 * That is why **all** details blocks **have to be unique elements**!
 * You can not create details block without unique attached to it.
 *
 * Opening a link to the details block in new tab will make it visible inside main prose content.
 * Because of this you should place them near the link pointing to them to keep context.
 *
 * Details blocks can't be added to Table of Contents and can't have snippets.
 *
 * @title Details
 * @layout block
 * @example
 * ```tsx
 * <P>
 *   The number 4 is even, which is <A to={{uniques.whyEven}}>obvious</A>.
 * </P>
 *
 * <Details $={{uniques.whyEven}} title="Why is 4 even?">
 *   <P>Because it is divisible by 2 without a remainder.</P>
 * </Details>
 * ```
 */
export const Details = '_tag_';
