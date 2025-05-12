import { build } from 'esbuild';
import { getGeneratorFilePath } from '@erudit-js/bitran-elements/problem/server';

export default defineEventHandler(async (event) => {
    const generatorContentPath = event.context.params!.path?.slice(0, -3);
    const generatorFilePath = await getGeneratorFilePath(generatorContentPath);

    const script = (
        await build({
            write: false,
            bundle: true,
            charset: 'utf8',
            format: 'esm',
            inject: ['@erudit-js/bitran-elements/problem/generator'],
            entryPoints: [generatorFilePath],
        })
    ).outputFiles[0]!.text;

    setResponseHeader(
        event,
        'Content-Type',
        'application/javascript; charset=utf-8',
    );

    return script;
});
