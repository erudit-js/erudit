import { defineElementTranspiler } from '@bitran-js/transpiler';

import { serverAbsolutizeContentPath } from '@server/repository/contentId';

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

            const generatorContentPath = serverAbsolutizeContentPath(
                node.parseData.generatorSrc!,
                runtime.context.location.path!,
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

                    const generatorContentPath = serverAbsolutizeContentPath(
                        generatorPath,
                        runtime.context.location.path!,
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
