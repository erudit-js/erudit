/**
 * Headings are used to split prose into sections:
 * * `<H1>` - major sections, key parts of prose
 * * `<H2>` - subsections
 * * `<H3>` - sub-subsections (rarely used)
 *
 * Headings have special behavior:
 * * Always appear in Table of Contents
 * * Automatically generate snippet titles so you don't have to manually write them.
 *
 * When adding heading to search make sure to specify a snippet title that will be understandable out of context.
 * * **Don't** "Description" -> **Do** "Description of Euclidean algorithm"
 * * **Don't** "Problem" -> **Do** "Problem with integers division"
 *
 * **Caution:** never use headings inside other blocks! They are only allowed at the top level of prose!
 *
 * @title Heading
 * @layout block
 * @example
 * ```tsx
 * <H1>Pythagorean theorem</H1>
 *
 * // ... Content ...
 *
 * // Add heading in "Quick links" section
 * <H2 snippet={{ quick: true }}>
 *   Triangles and squares
 * </H2>
 *
 * // ... Content ...
 *
 * // Provide more specific title for search
 * <H3 snippet={{ search: true, title: 'Pythagorean theorem in physics' }}>
 *   Usage in physics
 * </H3>
 *
 * // ... Content ...
 * ```
 */
export const H1 = '_tag_';
export const H2 = '_tag_';
export const H3 = '_tag_';
