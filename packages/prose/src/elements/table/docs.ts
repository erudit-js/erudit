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
let Table, Tr, Td;
