import {
    isRawElement,
    ProseError,
    type AnySchema,
    type AnyUnique,
    type AutoUnique,
    type LinkableTag,
    type RawElement,
    type Unique,
    type WrapSchemas,
} from '@jsprose/core';

import { DEFAULT_SEED, type ProblemSeed, Random } from './rng.js';
import {
    validateProblemContent,
    type CheckFunction,
    type ProblemContentChild,
} from './problemContent.js';

//
// Problem Script ID
//

export function stringifyProblemScriptId(
    scriptSrc: string,
    exportName: string,
): string {
    return `${scriptSrc}/${exportName}`;
}

export function parseProblemScriptId(scriptId: string): {
    scriptSrc: string;
    exportName: string;
} {
    const lastSlashIndex = scriptId.lastIndexOf('/');
    const scriptSrc = scriptId.substring(0, lastSlashIndex);
    const exportName = scriptId.substring(lastSlashIndex + 1);
    return { scriptSrc, exportName };
}

export function insertProblemScriptId(scriptSrc: string, code: string): string {
    // Match: const NAME = ... = defineProblemScript(...)
    // Handles both:
    // - export const NAME = defineProblemScript(...)
    // - const NAME = exports.NAME = defineProblemScript(...)
    return code.replace(
        /\bconst\s+([A-Za-z0-9_$]+)(?:\s*=\s*[A-Za-z0-9_$.]+)*\s*=\s*defineProblemScript\(([\s\S]*?)\)/g,
        (fullMatch, firstName, argsContent) => {
            const trimmed = argsContent.trim();

            // If the first argument already looks like a string literal, skip.
            if (/^['"`]/.test(trimmed)) {
                return fullMatch;
            }

            // Extract the actual name (the one right before defineProblemScript)
            const nameMatch = fullMatch.match(
                /=\s*([A-Za-z0-9_$]+)\s*=\s*defineProblemScript/,
            );
            const name = nameMatch ? nameMatch[1] : firstName;

            const needsNoSpace = /^\s*\n/.test(argsContent);
            const comma = needsNoSpace ? ',' : ', ';
            const newArgs = `'${stringifyProblemScriptId(scriptSrc, name)}'${comma}${argsContent}`;

            return fullMatch.replace(
                /defineProblemScript\(([\s\S]*?)\)/,
                `defineProblemScript(${newArgs})`,
            );
        },
    );
}

//
// Problem Script
//

export interface ProblemScriptDefinition {
    uniques?: Record<string, LinkableTag>;
    isGenerator?: boolean;
}

export function defineProblemScript<
    const TDefinition extends ProblemScriptDefinition,
>(scriptIdOrDefinition?: string | TDefinition, maybeDefinition?: TDefinition) {
    let scriptId: string;
    let definition: TDefinition;

    if (typeof scriptIdOrDefinition === 'string') {
        scriptId = scriptIdOrDefinition;
        definition = maybeDefinition!;
    } else {
        throw new ProseError(
            `Problem script requires script ID to be manually specified or inserted at transform time!`,
        );
    }

    const { scriptSrc, exportName } = parseProblemScriptId(scriptId);

    type ProblemContentFn = (
        args: (TDefinition['uniques'] extends Record<string, LinkableTag>
            ? {
                  uniques: {
                      [K in keyof NonNullable<TDefinition['uniques']>]: Unique<
                          NonNullable<TDefinition['uniques']>[K]
                      >;
                  };
              }
            : {}) &
            (TDefinition['isGenerator'] extends true
                ? { initial: boolean; random: Random }
                : {}),
    ) =>
        | RawElement<AnySchema>
        | {
              problemContent: RawElement<AnySchema>;
              check?: CheckFunction;
          };

    function defineProblemContent(problemContentFn: ProblemContentFn) {
        function createProblemScriptInstance(
            ...args: TDefinition['uniques'] extends Record<string, LinkableTag>
                ? [
                      uniquesMapping:
                          | (() => AutoUnique)
                          | {
                                [K in keyof NonNullable<
                                    TDefinition['uniques']
                                >]:
                                    | Unique<
                                          NonNullable<TDefinition['uniques']>[K]
                                      >
                                    | (() => AutoUnique);
                            },
                  ]
                : []
        ) {
            const finalizedUniques: Record<string, AnyUnique> = {};

            if (definition.uniques) {
                const uniquesMapping = args[0];
                if (typeof uniquesMapping === 'function') {
                    for (const key in definition.uniques) {
                        finalizedUniques[key] = uniquesMapping() as any;
                    }
                } else {
                    for (const key in uniquesMapping) {
                        const mapping = uniquesMapping[key];
                        if (typeof mapping === 'function') {
                            finalizedUniques[key] = mapping() as any;
                        } else {
                            finalizedUniques[key] = mapping;
                            // @ts-expect-error
                            delete finalizedUniques[key].rawElement;
                            // @ts-expect-error
                            delete finalizedUniques[key].tag;
                        }
                    }
                }
            }

            return {
                scriptSrc,
                exportName,
                uniques: finalizedUniques,
                isGenerator: definition.isGenerator ?? false,
                generate: (seed?: ProblemSeed) => {
                    const finalizedSeed = seed ?? DEFAULT_SEED;

                    const problemContentResult = problemContentFn({
                        uniques: finalizedUniques,
                        ...(definition.isGenerator
                            ? {
                                  initial: finalizedSeed === DEFAULT_SEED,
                                  random: new Random(finalizedSeed),
                              }
                            : {}),
                    } as any);

                    const problemContent = isRawElement(problemContentResult)
                        ? problemContentResult
                        : problemContentResult.problemContent;

                    validateProblemContent(
                        '[Problem Script]',
                        problemContent.children as any,
                    );

                    return {
                        problemContent: problemContent.children as WrapSchemas<
                            'raw-prose',
                            ProblemContentChild
                        >[],
                        check: !isRawElement(problemContentResult)
                            ? problemContentResult.check
                            : undefined,
                    };
                },
            } as ProblemScriptInstance;
        }

        return createProblemScriptInstance;
    }

    return defineProblemContent;
}

export interface ProblemScriptInstance {
    scriptSrc: string;
    exportName: string;
    uniques: Record<string, AnyUnique>;
    isGenerator: boolean;
    generate: (seed?: ProblemSeed) => {
        problemContent: WrapSchemas<'raw-prose', ProblemContentChild>[];
        check?: CheckFunction;
    };
}
