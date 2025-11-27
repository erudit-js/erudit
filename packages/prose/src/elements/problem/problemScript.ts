import {
    ProseError,
    type AnySchema,
    type mixSchema,
    type NormalizedChildren,
    type ProseElement,
    type RawElement,
} from '@jsprose/core';

import { normalizeSeed, Random, type ProblemSeed } from './rng.js';
import type { EruditProseContext } from '../../context.js';
import {
    validateProblemContent,
    type ProblemContentChild,
} from './problemContent.js';
import { resolveEruditRawElement } from '../../resolve.js';

/**
 * Static seed not random for SEO reasons.
 * It ensures that initial problem content is always the same on each build, helping search engines to index the problem consistently.
 */
const DEFAULT_SEED = '3141592653';

const scriptSrcNameSeparator = ' ↦ ';

export function constructProblemScriptId(
    scriptSrc: string,
    scriptName: string,
): string {
    return `${scriptSrc}${scriptSrcNameSeparator}${scriptName}`;
}

export function parseProblemScriptId(scriptId: string): {
    scriptSrc: string;
    scriptName: string;
} {
    const [scriptSrc, scriptName] = scriptId.split(scriptSrcNameSeparator);
    return { scriptSrc, scriptName };
}

export interface ProblemScriptDefinition {
    isGenerator?: boolean;
    initialSeed?: ProblemSeed;
}

export interface ProblemScript {
    scriptSrc: string;
    scriptName: string;
    isGenerator: boolean;
    createProblemContent: (
        seed: ProblemSeed,
        context: EruditProseContext,
    ) =>
        | ProseElement<ProblemContentChild>[]
        | Promise<ProseElement<ProblemContentChild>[]>;
}

export type BuildProblemContentFunction = (args: {
    initial: boolean;
    random: Random;
}) => RawElement<AnySchema> | Promise<RawElement<AnySchema>>;

export type DefineProblemScriptReturn = (
    buildProblemContent: BuildProblemContentFunction,
) => ProblemScript;

export function defineProblemScript(): DefineProblemScriptReturn;

export function defineProblemScript(
    scriptId: string,
    definition?: ProblemScriptDefinition,
): DefineProblemScriptReturn;

export function defineProblemScript(
    definition: ProblemScriptDefinition,
): DefineProblemScriptReturn;

export function defineProblemScript(
    idOrDefinition?: string | ProblemScriptDefinition,
    maybeDefinition?: ProblemScriptDefinition,
): DefineProblemScriptReturn {
    let scriptId: string;
    let definition: ProblemScriptDefinition;

    if (typeof idOrDefinition === 'string') {
        scriptId = idOrDefinition;
        definition = maybeDefinition ?? {};
    } else if (maybeDefinition) {
        scriptId = idOrDefinition as string;
        definition = maybeDefinition;
    } else {
        throw new ProseError(
            `
Problem script ID was not inserted!
When using defineProblemScript, you must either provide ID explicitly or insert it at transform/bundle time.
            `.trim(),
        );
    }

    const [scriptSrc, scriptName] = scriptId.split(scriptSrcNameSeparator);
    const isGenerator = definition.isGenerator ?? false;
    const initialSeed = definition.initialSeed ?? DEFAULT_SEED;

    function createProblemContent(
        buildProblemContent: (args: {
            initial: boolean;
            random: Random;
        }) => RawElement<AnySchema> | Promise<RawElement<AnySchema>>,
    ): ProblemScript {
        return {
            scriptSrc,
            scriptName,
            isGenerator,
            async createProblemContent(
                seed: ProblemSeed,
                context: EruditProseContext,
            ) {
                const normalizedSeed = normalizeSeed(seed);
                const random = new Random(normalizedSeed);
                const problemContentMix = (await buildProblemContent({
                    initial: normalizedSeed === normalizeSeed(initialSeed),
                    random,
                })) as RawElement<typeof mixSchema>;

                validateProblemContent(
                    `[Problem Script: ${scriptId}]`,
                    problemContentMix.children as NormalizedChildren,
                );

                const proseProblemContent = await resolveEruditRawElement({
                    context: { ...context, linkable: false },
                    rawElement: problemContentMix,
                });

                return proseProblemContent.proseElement
                    .children as ProseElement<ProblemContentChild>[];
            },
        };
    }

    return createProblemContent;
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
            const newArgs = `'${constructProblemScriptId(scriptSrc, name)}'${comma}${argsContent}`;

            return fullMatch.replace(
                /defineProblemScript\(([\s\S]*?)\)/,
                `defineProblemScript(${newArgs})`,
            );
        },
    );
}

export type ProblemScriptStorage = {
    resolvedScriptSrc: string;
};

export function problemScriptStrorageKey(scriptSrc: string): string {
    return `problemScript:${scriptSrc}`;
}
