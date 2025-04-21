import { defineElementTranspiler } from '@bitran-js/transpiler';

import { getNavBookIds } from '@server/nav/utils';
import { toAbsoluteContentId } from '@erudit/shared/bitran/contentId';

import {
    type ProblemsSchema,
    type ProblemSchema,
    problemRenderDataGenerator,
    problemRenderDataKey,
} from './shared';
import { problemsTranspiler, problemTranspiler } from './transpiler';

export const problemServerTranspiler = defineElementTranspiler<ProblemSchema>({
    ...problemTranspiler,
    renderDataGenerator: {
        ...problemRenderDataGenerator,
        async createValue({ node, extra: runtime }) {
            if (!runtime) {
                throw new Error(
                    'Missing runtime when prerendering Problem element!',
                );
            }

            const generatorContentPath = toAbsoluteContentId(
                node.parseData.generatorSrc!,
                runtime.context.location.path!,
                getNavBookIds(),
            );

            return {
                generatorContentPath,
            };
        },
    },
});

export const problemsServerTranspiler = defineElementTranspiler<ProblemsSchema>(
    {
        ...problemsTranspiler,
        renderDataGenerator: {
            async createValue({ node, storage, extra: runtime }) {
                const generatorPaths = node.parseData.set.map(
                    (problem) => problem.generatorSrc,
                );

                for (const generatorPath of generatorPaths) {
                    if (!generatorPath) {
                        continue;
                    }

                    const key = problemRenderDataKey(generatorPath)!;

                    const generatorContentPath = toAbsoluteContentId(
                        generatorPath,
                        runtime.context.location.path!,
                        getNavBookIds(),
                    );

                    storage[key] ||= {
                        type: 'success',
                        data: {
                            generatorContentPath,
                        },
                    };
                }

                return undefined;
            },
        },
    },
);
