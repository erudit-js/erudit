/**
 * Inliner math is used to display mathematical expressions within a line of text.
 * It supports line breaks and has a faint of brand color to distinguish it from regular text.
 *
 * **Caution:** Never write long mathematical expressions in inliner math because it looks horrible.
 * Use it for variables, numbers, or short two to three term expressions only.
 *
 * Math is written using [LaTeX syntax](https://www.latex-project.org/) and rendered using [KaTeX](https://katex.org/docs/supported.html).
 *
 * You can also use nice colors in your math expressions:
 * * `\brand{...}`
 * * `\blue{...}`
 * * `\green{...}`
 * * `\yellow{...}`
 * * `\red{...}`
 * * `\default{...}` (to reset to default color)
 *
 * @title Inliner Math
 * @layout inliner
 * @example
 * ```tsx
 * <>
 *   We need variables <M>x</M> and <M>y</M>.
 *   They are wrapped in square roots <M>{math`\sqrt{x}`}</M> and <M>{math`\sqrt{y}`}</M>.
 * </>
 * ```
 */
export const M = '_tag_';

/**
 * Block math is used to display mathematical expressions as separate blocks.
 * Use it for larger equations that need to be centered and stand out from the main text.
 *
 * Math is written using [LaTeX syntax](https://www.latex-project.org/) and rendered using [KaTeX](https://katex.org/docs/supported.html).
 *
 * You can also use nice colors in your math expressions:
 * * `\brand{...}`
 * * `\blue{...}`
 * * `\green{...}`
 * * `\yellow{...}`
 * * `\red{...}`
 * * `\default{...}` (to reset to default color)
 *
 * Use `freeze` prop to prevent line breaks in the rendered math (scrollbars will appear if the content overflows).
 *
 * You can also create flexible "breaking" gaps between expressions using `>>`, `>>{0|small|big|100px}` delimiters.
 * Also you can specify the vertical aligment of such gaps using `>>{top|center|bottom}`.
 *
 * @title Block Math
 * @layout block
 * @example
 * ```tsx
 * <BlockMath>{math`
 *   A^2 + \green{B^2} = \brand{C^2}
 * `}</BlockMath>
 *
 * <BlockMath freeze>{math`
 *   \lim\limits_{x \to \infty} \frac{1}{x} = 0
 * `}</BlockMath>
 *
 * <BlockMath>{math`
 *   a^2 >> b^2 >>{big} c^2 >>{top} \sqrt{a^2 + b^2} >>{small}{bottom} \frac{a^2 + b^2}{c^2}
 * `}</BlockMath>
 * ```
 */
export const BlockMath = '_tag_';

/**
 * Math template tag function for writing LaTeX math expressions.
 * It allows not to escape backslashes in LaTeX commands.
 *
 * @example
 * ```tsx
 * const bad = `\\frac{a}{b}`;
 * // But
 * const good = math`\frac{a}{b}`;
 * ```
 */
export const math: typeof String.raw;
