/**
 * Tables are used to organize data into rows and columns.
 * Rows (`<Tr>` — table row) goes first, then data cells (`<Td>` — table data) within each row which represent the columns.
 *
 * Tables can optionally have a `<Caption>` as their last child.
 *
 * @title Table
 * @layout block
 * @example
 * ```tsx
 * // Name  | Age | City
 * // Alice | 30  | New York
 * // Bob   | 25  | Los Angeles
 * <Table>
 *   <Tr>
 *     <Td>Name</Td>
 *     <Td>Age</Td>
 *     <Td>City</Td>
 *   </Tr>
 *   <Tr>
 *     <Td>Alice</Td>
 *     <Td>30</Td>
 *     <Td>New York</Td>
 *   </Tr>
 *   <Tr>
 *     <Td>Bob</Td>
 *     <Td>25</Td>
 *     <Td>Los Angeles</Td>
 *   </Tr>
 *   <Caption>Example Table</Caption>
 * </Table>
 * ```
 */
export const Table = '_tag_';
export const Tr = '_tag_';

/**
 * Table data cell. Placed inside `<Tr>`.
 *
 * **Alignment:** use `center` or `right` to align cell content (mutually exclusive).
 *
 * **Freeze:** use `freeze` to prevent the cell content from wrapping.
 *
 * **Spanning:**
 * - `hspan` — horizontal span (equivalent to HTML `colspan`). Merges the cell with the given number of columns.
 * - `vspan` — vertical span (equivalent to HTML `rowspan`). Merges the cell with the given number of rows.
 *
 * @example
 * ```tsx
 * // Merge two columns
 * <Td hspan={2}>Wide cell</Td>
 *
 * // Merge two rows
 * <Td vspan={2}>Tall cell</Td>
 *
 * // Merge both
 * <Td hspan={2} vspan={2}>Big cell</Td>
 * ```
 */
export const Td = '_tag_';
