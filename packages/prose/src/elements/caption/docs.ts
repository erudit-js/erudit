/**
 * Captions are used to provide descriptive text for images, videos, and other media elements.
 * They can contain content (which is treated as the main caption) and an optional secondary caption for additional context.
 *
 * @title Caption
 * @layout inliner
 * @example
 * ```tsx
 * <Image src={triangleA}>
 *   <Caption width="300px">
 *     A right-angled triangle with sides <M>A</M>, <M>B</M> and hypotenuse <M>C</M>.
 *   </Caption>
 * </Image>
 *
 * <Video src={lawOfSines}>
 *   <Caption>
 *     Law of sines explanation.
 *     <CaptionSecondary>
 *       Pay attention to the angle notation!
 *     </CaptionSecondary>
 *   </Caption>
 * </Video>
 * ```
 */
let Caption, CaptionSecondary;
