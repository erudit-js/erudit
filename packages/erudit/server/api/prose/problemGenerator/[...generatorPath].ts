import esbuild from 'esbuild';

export default defineEventHandler<Promise<string>>(async (event) => {
    const pathToGenerator =
        'E:/code/erudit-js/erudit/playground/content/3+group-x/3-sub-group/1-sub-page/problems/diego.tsx';

    const result = await esbuild.build({
        entryPoints: [pathToGenerator],
        bundle: true,
        platform: 'node',
        format: 'esm',
        write: false,
        jsx: 'automatic',
        jsxImportSource: '@erudit-js/prose',
        sourcemap: false,
        minify: false,
        target: 'esnext',
        charset: 'utf8',
        external: ['@erudit-js/prose/jsx-runtime'],
    });

    const output = result.outputFiles?.[0]?.text ?? '';

    const cleanedOutput = output.replace(
        /import\s*(?:[\w*\s{},]*from\s*)?['"][^'"]+['"];?/g,
        '',
    );

    setHeader(event, 'content-type', 'text/javascript');
    return cleanedOutput;
});
