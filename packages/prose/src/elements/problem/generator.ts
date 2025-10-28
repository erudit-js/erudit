import type { ProseContext } from '../../context';
import type { BlocksSchema } from '../../default/blocks';
import type { JsxElement, ParsedElement } from '../../element';
import { parseJsxContent } from '../../parse';
import type { ElementSchemaAny } from '../../schema';
import { validateProblemContent, type ProblemContentChild } from './content';

export interface GeneratorDefinition {
    /** The location of generator module. Normally you pass `import.meta.url` here. */
    url: string;
    initialSeed?: ProblemSeed;
}

export interface ProblemGenerator {
    url: string;
    initialSeed: ProblemSeed;
    createProblemContent: (
        seed: ProblemSeed,
        context: ProseContext,
    ) =>
        | ParsedElement<ProblemContentChild>[]
        | Promise<ParsedElement<ProblemContentChild>[]>;
}

export function defineProblemGenerator(definition: GeneratorDefinition) {
    const randomSeed = Math.floor(Math.random() * 1000000) + 1; // Use random or some static value?
    const initialSeed = definition.initialSeed ?? randomSeed;

    return (
        problemJsxFn: (args: {
            random: Random;
        }) =>
            | JsxElement<ElementSchemaAny>
            | Promise<JsxElement<ElementSchemaAny>>,
    ): ProblemGenerator => {
        return {
            url: definition.url,
            initialSeed,
            createProblemContent: async (
                seed: ProblemSeed,
                context: ProseContext,
            ) => {
                const normalizedSeed = normalizeSeed(seed);
                const random = new Random(normalizedSeed);
                const jsxProblemContent = await problemJsxFn({ random });

                validateProblemContent(
                    '[Problem Generator]',
                    jsxProblemContent.children,
                );

                const parsedProblemContent = await parseJsxContent({
                    context,
                    content: jsxProblemContent as JsxElement<BlocksSchema>,
                    step: async (element) => {
                        delete element.domId;
                    },
                });

                return parsedProblemContent.parsedTree
                    .children as ParsedElement<ProblemContentChild>[];
            },
        };
    };
}

//
// RNG
//

export type ProblemSeed = string | number;

function normalizeSeed(seed: ProblemSeed) {
    if (typeof seed === 'number') return seed;
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
        hash = (hash << 5) - hash + seed.charCodeAt(i);
        hash |= 0;
    }
    return hash;
}

function splitmix32(seed: number) {
    return function () {
        seed |= 0;
        seed = (seed + 0x9e3779b9) | 0;
        let t = seed ^ (seed >>> 16);
        t = Math.imul(t, 0x21f0aaad);
        t = t ^ (t >>> 15);
        t = Math.imul(t, 0x735a2d97);
        return (t = t ^ (t >>> 15)) >>> 0;
    };
}

export class Random {
    private _rng: () => number;

    constructor(seed: ProblemSeed) {
        const normalizedSeed = normalizeSeed(seed);
        this._rng = splitmix32(normalizedSeed);
    }

    rng() {
        return this._rng();
    }

    boolean() {
        return this.rng() % 2 === 0;
    }

    integer(min: number, max: number) {
        const range = max - min + 1;
        return (this.rng() % range) + min;
    }

    float(min: number, max: number, decimals: number) {
        const range = max - min;
        const randomValue = (this.rng() / 0xffffffff) * range + min;
        return parseFloat(randomValue.toFixed(decimals));
    }

    shuffle<T>(arr: T[]) {
        const shuffled = [...arr];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = this.rng() % (i + 1);
            [shuffled[i]!, shuffled[j]!] = [shuffled[j]!, shuffled[i]!];
        }
        return shuffled;
    }

    arrayElement<T>(arr: T[]) {
        if (arr.length === 0) return undefined;
        const index = this.rng() % arr.length;
        return arr[index];
    }

    arrayElements<T>(arr: T[], count: number, unique = true) {
        if (arr.length === 0) return [];

        const result: T[] = [];

        if (unique) {
            const shuffled = this.shuffle(arr);
            for (let i = 0; i < count && i < shuffled.length; i++) {
                result.push(shuffled[i]!);
            }
        } else {
            for (let i = 0; i < count; i++) {
                const index = this.rng() % arr.length;
                result.push(arr[index]!);
            }
        }

        return result;
    }
}
