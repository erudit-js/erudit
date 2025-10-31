import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import esbuild from 'esbuild';

import type { GenericStorage, ParsedElement } from '@erudit-js/prose';
import type { ProblemSchema } from '@erudit-js/prose/elements/problem/problem.global';
import type { SubProblemSchema } from '@erudit-js/prose/elements/problem/problems.global';
import type { ProblemStorage } from '@erudit-js/prose/elements/problem/index';
import type { ProblemGenerator } from '@erudit-js/prose/elements/problem/generator';
import { imageExtensions } from '@erudit-js/prose/elements/image/index';
import { videoExtensions } from '@erudit-js/prose/elements/video/index';

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
            .replace(
                ERUDIT.config.paths.project + '/content/',
                'api/prose/problemGenerator/',
            )
            .replace(/\.(tsx|jsx|ts)$/, '.js')
    );
}

export async function bundleProblemGenerator(
    generatorFilePath: string,
): Promise<string> {
    const bundle = await esbuild.build({
        entryPoints: [generatorFilePath],
        bundle: true,
        platform: 'browser',
        format: 'esm',
        write: false,
        jsx: 'automatic',
        jsxImportSource: '@erudit-js/prose',
        sourcemap: false,
        minify: false,
        target: 'esnext',
        charset: 'utf8',
        alias: {
            '#project': ERUDIT.config.paths.project + '/',
            '#content': ERUDIT.config.paths.project + '/content/',
        },
        external: ['@erudit-js/prose/jsx-runtime'],
        plugins: [
            {
                name: 'file-src',
                setup(build) {
                    const extensions = [...imageExtensions, ...videoExtensions];
                    const extensionsPattern = extensions
                        .map((ext) => ext.replace('.', ''))
                        .join('|');
                    build.onLoad(
                        { filter: new RegExp(`\\.(${extensionsPattern})$`) },
                        (args) => {
                            let absPath = resolve(args.path);
                            absPath = absPath.replaceAll('\\', '/');
                            return {
                                loader: 'js',
                                contents: 'export default "' + absPath + '";',
                            };
                        },
                    );
                },
            },
        ],
    });

    let code = bundle.outputFiles![0]!.text;
    code = code.replace(
        /import\s*(?:[\w*\s{},]*from\s*)?['"][^'"]+['"];?/g,
        '',
    );

    return code;
}
