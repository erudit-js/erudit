/**
 * Lists can be either ordered (numbered) or unordered (bulleted).
 * Ordered lists support a `start` attribute to specify the starting number.
 *
 * Each list must contain only `<Li>` (list item) elements as children.
 * List items can contain inliners or blocks.
 *
 * @title List
 * @layout block
 * @example
 * ```tsx
 * <List type="ul">
 *   <Li>First unordered item</Li>
 *   <Li>
 *     <P>Second unordered item with paragraph inside</P>
 *     <P>Another paragraph in the same item</P>
 *   </Li>
 * </List>
 *
 * <List type="ol">
 *   <Li>First ordered item (numbered 1)</Li>
 * </List>
 *
 * <List type="ol" start={3}>
 *   <Li>Third ordered item (numbered 3)</Li>
 *   <Li>Fourth ordered item (numbered 4)</Li>
 * </List>
 * ```
 */
export const List = '_tag_';

/**
 * List item element.
 * Must be used only inside `<List>` elements.
 *
 * Can contain inliners or blocks as children.
 *
 * @title List Item
 * @layout block
 * @example
 * ```tsx
 * <Li>Simple list item with inliners</Li>
 *
 * <Li>
 *   <P>List item with a paragraph inside</P>
 *   <P>Another paragraph in the same item</P>
 * </Li>
 * ```
 */
export const Li = '_tag_';
