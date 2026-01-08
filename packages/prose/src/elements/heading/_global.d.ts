/**
 * Headings are used to split prose into sections:
 * * `<H1>` - major sections, key parts of prose
 * * `<H2>` - subsections
 * * `<H3>` - sub-subsections (rarely used)
 *
 * Headings have special behavior:
 * * Always appear in search results
 * * Always appear in Table of Contents
 * * Automatically generate snippet titles so you don't have to manually write them.
 *
 * That is why you want to always write meaningful titles and never use general words!
 * * **Don't** "Description" -> **Do** "Description of Euclidean algorithm"
 * * **Don't** "Problem" -> **Do** "Problem with integers division"
 *
 * If you really need to use general words, provide specified snippet title or search synonyms.
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
 * <H3 snippet={{ title: 'Pythagorean theorem in physics' }}>
 *   Usage in physics
 * </H3>
 *
 * // ... Content ...
 * ```
 */
export const H1 = '_tag_';
export const H2 = '_tag_';
export const H3 = '_tag_';
