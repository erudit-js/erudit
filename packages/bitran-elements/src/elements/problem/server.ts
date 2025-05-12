import { defineElementTranspiler } from '@bitran-js/transpiler';

import { serverAbsolutizeContentPath } from '@server/repository/contentId';
import { ERUDIT_SERVER } from '@server/global';
import { DbFile } from '@server/db/entities/File';
import { PROJECT_DIR } from '#erudit/globalPaths';
import {
    type ProblemsSchema,
    type ProblemSchema,
    problemRenderDataGenerator,
    problemRenderDataKey,
} from './shared';
import { problemsTranspiler, problemTranspiler } from './transpiler';
import { createError } from '#imports';

export async function getGeneratorFilePath(fullContentPath?: string) {
    if (!fullContentPath) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Missing path to task generator!',
        });
    }

    const dbFile = await ERUDIT_SERVER.DB.manager.findOne(DbFile, {
        where: [
            { path: fullContentPath },
            ...['.ts', '.js', '.gen.ts', '.gen.js'].map((ending) => ({
                path: `${fullContentPath}${ending}`,
            })),
        ],
    });

    if (!dbFile) {
        throw createError({
            statusCode: 404,
            statusMessage: `Task generator file "${fullContentPath}" not found!`,
        });
    }

    return PROJECT_DIR + '/content/' + dbFile.fullPath;
}

// Helper function to resolve and validate generator paths
async function resolveGeneratorPath(generatorSrc: string, runtimePath: string) {
    const generatorContentPath = serverAbsolutizeContentPath(
        generatorSrc,
        runtimePath,
    );

    await getGeneratorFilePath(generatorContentPath);

    return generatorContentPath;
}

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

            const generatorContentPath = await resolveGeneratorPath(
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

                    const generatorContentPath = await resolveGeneratorPath(
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
