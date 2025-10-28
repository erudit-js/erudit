import { existsSync } from 'node:fs';

import type { GenericStorage, ParsedElement } from '@erudit-js/prose';
import type { ProblemSchema } from '@erudit-js/prose/elements/problem/problem.global';
import type { SubProblemSchema } from '@erudit-js/prose/elements/problem/problems.global';
import type { ProblemStorage } from '@erudit-js/prose/elements/problem/index';
import type { ProblemGenerator } from '@erudit-js/prose/elements/problem/generator';

export async function generateInitialProblemContent(
    element: ParsedElement<ProblemSchema> | ParsedElement<SubProblemSchema>,
    storage: GenericStorage,
): Promise<void> {
    if (!element.data.generatorPath) {
        return;
    }

    const storageValue: ProblemStorage = {
        generatorUrl: problemGeneratorPath2Url(element.data.generatorPath),
    };

    storage[element.storageKey!] = storageValue;

    try {
        const generator = (await ERUDIT.import(element.data.generatorPath, {
            default: true,
        })) as ProblemGenerator;

        const parsedProblemContent = await generator.createProblemContent(
            generator.initialSeed,
            {
                language: ERUDIT.config.public.project.language.current,
            },
        );

        element.children = parsedProblemContent as any;
    } catch (error) {
        throw createError({
            statusCode: 500,
            statusMessage: `Failed to generate initial problem content from generator: ${element.data.generatorPath}!\nError: ${error}`,
        });
    }
}

export function problemGeneratorPath2Url(generatorPath: string): string {
    if (!existsSync(generatorPath)) {
        throw createError({
            statusCode: 404,
            statusMessage: `Problem generator file not found: ${generatorPath}!`,
        });
    }

    return (
        ERUDIT.config.public.project.baseUrl +
        generatorPath
            .replace(ERUDIT.config.paths.project + '/content/', '')
            .replace(/\.(tsx|jsx|ts)$/, '.js')
    );
}
