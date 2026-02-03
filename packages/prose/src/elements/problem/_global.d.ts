import type { ProblemCustomAttribute as PAC } from './shared.js';

/**
 * Problems are used to present exercises and questions to the reader.
 * See the example for a full breakdown of the sub-elements available.
 *
 * All problems are added to TOC and search by default (can be disabled via tag properties).
 *
 * @title Problem
 * @layout block
 * @example
 * ```tsx
 * // Static problem
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
 *   // More checks...
 *
 *   <ProblemNote>
 *     In fact, you can find the square of any number by multiplying it by itself!
 *   </ProblemNote>
 * </Problem>
 *
 * // Script problem
 * export const fooScript = defineProblemScript({
 *   isGenerator: true,
 * })(({ initial, random }) => {
 *   const a = initial.nextInt(1, 10);
 *   const b = initial.nextInt(1, 10);
 *
 *   return (
 *     <>
 *       <ProblemDescription>
 *         What is <M>{a} + {b}</M>?
 *       </ProblemDescription>
 *       <ProblemAnswer>
 *         <M>{a + b}</M>
 *       </ProblemAnswer>
 *       <ProblemCheck label="The answer is" answer={a + b} />
 *     </>
 *   );
 * });
 *
 * <Problem title="Addition Problem" level="medium" script={fooScript} />
 * ```
 */
export const Problem = '_tag_';
export const ProblemDescription = '_tag_';
export const ProblemHint = '_tag_';
export const ProblemSection = '_tag_';
export const ProblemSolution = '_tag_';
export const ProblemAnswer = '_tag_';
export const ProblemNote = '_tag_';
export const ProblemCheck = '_tag_';

/**
 * Problem set is a collection of related problems presented together.
 * `<Problems>` tag contains general problem information and insude can have multiple `<SubProblem>` tags.
 *
 * Each `<SubProblem>` contains the same problem content tags as single `<Problem>` tag.
 *
 * All problems are added to TOC and search by default (can be disabled via tag properties).
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
export const SubProblem = '_tag_';

/**
 * Typeguard for creating custom problem attributes.
 */
export type ProblemCustomAttribute = PAC;
