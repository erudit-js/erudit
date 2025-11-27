/**
 * Diagrams written in [Mermaid](https://mermaid.js.org/syntax/flowchart.html) syntax.
 *
 * Diagrams can optionally have a `<Caption>` as their last child.
 *
 * @title Diagram
 * @layout block
 * @example
 * ```tsx
 * <Diagram>
 *   {`
 *       flowchart TD
 *         A[Start] --> B{Is it working?}
 *   `}
 *   <Caption>Simple flowchart diagram</Caption>
 * </Diagram>
 * ```
 */
let Diagram;
