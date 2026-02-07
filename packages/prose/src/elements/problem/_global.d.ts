import type { ProblemCustomAttribute as PAC } from './shared.js';
import type { ProblemRandom as _ProblemRandom } from './rng.js';

/**
 * Problems are used to present exercises and questions to the reader.
 *
 * Allowed children inside `<Problem>`:
 * - `<ProblemDescription>`
 * - `<ProblemCheck>` (repeatable)
 * - `<ProblemHint>` (repeatable)
 * - `<ProblemAnswer>` (optionally with `<ProblemSection>`)
 * - `<ProblemSolution>` (optionally with `<ProblemSection>`)
 * - `<ProblemNote>` (optionally with `<ProblemSection>`)
 *
 * @title Problem
 * @layout block
 * @example
 * ```tsx
 * <Problem title="Find the square" level="easy">
 *   <ProblemDescription>
 *     <P>What is the square of 2?</P>
 *     <P>Think carefully about your answer before proceeding to the hints and solution.</P>
 *   </ProblemDescription>
 *
 *   <ProblemHint>
 *     <P>Recall that squaring a number means multiplying it by itself.</P>
 *   </ProblemHint>
 *   <ProblemHint>
 *     <P>For example, the square of 3 is 9, since 3 * 3 = 9.</P>
 *   </ProblemHint>
 *   // More hints...
 *
 *   <ProblemSolution>
 *     <P>Some general phrases visible immediately.</P>
 *
 *     <ProblemSection title="Detailed Solution">
 *       <P>The square of 2 is 4, since 2 * 2 = 4.</P>
 *     </ProblemSection>
 *     // More sections...
 *
 *   </ProblemSolution>
 *
 *   <ProblemAnswer>
 *     <P><M>4</M></P>
 *   </ProblemAnswer>
 *
 *   <ProblemCheck label="The square of 2 is" answer={4} />
 *
 *   <ProblemNote>
 *     In fact, you can find the square of any number by multiplying it by itself!
 *   </ProblemNote>
 * </Problem>
 * ```
 */
export const Problem = '_tag_';

/**
 * Problem description.
 *
 * Can be used inside `<Problem>` or `<SubProblem>`.
 *
 * @title ProblemDescription
 * @layout block
 * @example
 * ```tsx
 * <ProblemDescription>
 *   <P>State the problem in your own words.</P>
 * </ProblemDescription>
 * ```
 */
export const ProblemDescription = '_tag_';

/**
 * A hint for the problem. Multiple hints can be provided.
 *
 * Can be used inside `<Problem>` or `<SubProblem>`.
 *
 * @title ProblemHint
 * @layout block
 * @example
 * ```tsx
 * <ProblemHint>
 *   <P>Try rewriting the expression in a simpler form.</P>
 * </ProblemHint>
 * ```
 */
export const ProblemHint = '_tag_';

/**
 * A titled section used inside `<ProblemSolution>` or `<ProblemAnswer>`.
 *
 * @title ProblemSection
 * @layout block
 * @example
 * ```tsx
 * <ProblemSection title="Method">
 *   <P>Show the steps.</P>
 * </ProblemSection>
 * ```
 */
export const ProblemSection = '_tag_';

/**
 * The problem solution.
 *
 * Can contain plain content and `<ProblemSection>` blocks.
 * Can be used inside `<Problem>` or `<SubProblem>`.
 *
 * @title ProblemSolution
 * @layout block
 * @example
 * ```tsx
 * <ProblemSolution>
 *   <P>Start with the key idea.</P>
 *
 *   <ProblemSection title="Details">
 *     <P>Then provide the full derivation.</P>
 *   </ProblemSection>
 * </ProblemSolution>
 * ```
 */
export const ProblemSolution = '_tag_';

/**
 * The final answer (usually concise).
 *
 * Can contain plain content and `<ProblemSection>` blocks.
 * Can be used inside `<Problem>` or `<SubProblem>`.
 *
 * @title ProblemAnswer
 * @layout block
 * @example
 * ```tsx
 * <ProblemAnswer>
 *   <P><M>42</M></P>
 * </ProblemAnswer>
 * ```
 */
export const ProblemAnswer = '_tag_';

/**
 * A note shown after the checks/solution.
 *
 * Can be used inside `<Problem>` or `<SubProblem>`.
 *
 * @title ProblemNote
 * @layout block
 * @example
 * ```tsx
 * <ProblemNote>
 *   Remember to double-check units.
 * </ProblemNote>
 * ```
 */
export const ProblemNote = '_tag_';

/**
 * Defines an answer check for a problem.
 *
 * Can be used inside `<Problem>` or `<SubProblem>`.
 *
 * Validator props (exactly one per `<ProblemCheck>`):
 * - `yes`: boolean-like answer, validated via locale yes/no patterns.
 * - `no`: boolean-like answer, validated via locale yes/no patterns.
 * - `answer`: exact expected value.
 *   - `number` -> numeric equality
 *   - `string` -> exact string match
 *   - `RegExp` -> `test()` match
 *   - `undefined` -> expects an empty answer
 * - `answers`: multi-part answer (split by `separator`, default `,`, unordered by default).
 *   - Use `{ ordered, separator, values }` to configure matching.
 *   - Each position in `values` can be a single expected value or an array of expected values (any-of).
 * - `script`: named script validator.
 *
 * You can nest `<ProblemCheck>` inside another `<ProblemCheck>` to group multiple checks.
 *
 * @title ProblemCheck
 * @layout block
 * @example
 * ```tsx
 * <ProblemCheck label="2 is even" yes />
 * <ProblemCheck label="Enter nothing" answer={undefined} />
 * <ProblemCheck label="The square of 2 is" answer={4} />
 * <ProblemCheck
 *   label="Enter roots"
 *   answers={{ ordered: false, separator: ',', values: [2, [-2, /-?2/]] }}
 * />
 * <ProblemCheck script="myCustomValidator" />
 *
 * <ProblemCheck label="Grouped checks" yes>
 *   <ProblemCheck label="Also accept 42" answer={42} />
 * </ProblemCheck>
 * ```
 */
export const ProblemCheck = '_tag_';

/**
 * Problem set is a collection of related problems presented together.
 *
 * Allowed children inside `<Problems>`:
 * - `<SubProblem>` (repeatable)
 *
 * Each `<SubProblem>` can contain the same child tags as `<Problem>`.
 *
 * @title Problems
 * @layout block
 * @example
 * ```tsx
 * // export const problemScript = defineProblemScript(...) ~> see Problem docs for details
 * <Problems title="Sample Problem Set" level="hard">
 *   <SubProblem label="Example">
 *     <ProblemDescription>
 *       This is an example sub-problem.
 *     </ProblemDescription>
 *   </SubProblem>
 *
 *   <SubProblem script={problemScript} />
 * </Problems>
 * ```
 */
export const Problems = '_tag_';

/**
 * A single problem inside a `<Problems>` set.
 *
 * Allowed children inside `<SubProblem>`:
 * - `<ProblemDescription>`
 * - `<ProblemHint>` (repeatable)
 * - `<ProblemSolution>` (optionally with `<ProblemSection>`)
 * - `<ProblemAnswer>` (optionally with `<ProblemSection>`)
 * - `<ProblemCheck>` (repeatable)
 * - `<ProblemNote>`
 *
 * @title SubProblem
 * @layout block
 * @example
 * ```tsx
 * <SubProblem label="A">
 *   <ProblemDescription>
 *     <P>Solve for <M>x</M>.</P>
 *   </ProblemDescription>
 *
 *   <ProblemCheck answer={42} />
 * </SubProblem>
 * ```
 */
export const SubProblem = '_tag_';

/**
 * Typeguard for creating custom problem attributes.
 */
export type ProblemCustomAttribute = PAC;

/**
 * Typeguard for problem RNG.
 */
export type ProblemRandom = _ProblemRandom;
