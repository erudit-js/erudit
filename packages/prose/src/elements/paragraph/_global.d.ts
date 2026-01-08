/**
 * Paragraph are general prose containers.
 *
 * When writing paragraphs, stick to **"rule of 3"**:
 * * Ideally **3** sentences per paragraph.
 * * After each **3** paragraphs use a different block: heading, list, image, formula, etc.
 *
 * Paragraphs can be centered via `center` prop, and can use serif font style via `serif` prop.
 * Use these with extra caution, as they reduce readability if overused!
 *
 * @title Paragraph
 * @layout block
 * @example
 * ```tsx
 * <P>Normal Paragraph</P>
 *
 * <P center>Centered Paragraph</P>
 * <P serif>Paragraph with serif font style</P>
 * <P center serif>Centered Paragraph with serif font style</P>
 *
 * <P>
 *   Paragraph<Br />
 *   With Line Break
 * </P>
 * ```
 */
export const P = '_tag_';
