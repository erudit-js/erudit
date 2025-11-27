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
 *   They are wrapped in square roots <M>{`\\sqrt{x}`}</M> and <M>{`\\sqrt{y}`}</M>.
 * </>
 * ```
 */
let M;

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
 * @title Block Math
 * @layout block
 * @example
 * ```tsx
 * <BlockMath>{`
 *   A^2 + \\green{B^2} = \\brand{C^2}
 * `}</BlockMath>
 *
 * <BlockMath>{`
 *   \\lim\\limits_{x \\to \\infty} \\frac{1}{x} = 0
 * `}</BlockMath>
 * ```
 */
let BlockMath;
