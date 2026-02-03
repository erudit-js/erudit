/**
 * Flex allows to place items next to each other in a row.
 * This is useful for grouping blocks with same context (images, diagrams, etc.), side-by-side comparisons, and similar layouts.
 *
 * By default items are placed at center with a small gap between them.
 * Placement and gap can be customized via `justify` and `gap` props, which work the same way as CSS `justify-content` and `gap` properties.
 *
 * @title Flex
 * @layout block
 * @example
 * ```tsx
 * <Flex>
 *   <Image src={schema1} width="100px" />
 *   <Image src={schema2} width="75px" />
 * </Flex>
 *
 * <Flex gap="40px" justify="space-between">
 *   <Image src={schema1} width="100px" />
 *   <Image src={schema2} width="75px" />
 * </Flex>
 * ```
 */
export const Flex = '_tag_';
