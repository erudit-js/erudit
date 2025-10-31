import { bundleProblemGenerator } from '@erudit/server/prose/default/problem';

export default defineEventHandler<Promise<string>>(async (event) => {
    const generatorContentRelativePath = event.context.params!.generatorPath;

    const generatorFilePath =
        ERUDIT.config.paths.project +
        '/content/' +
        generatorContentRelativePath.replace(/\.js$/, '.tsx');

    setHeader(event, 'content-type', 'text/javascript');
    return await bundleProblemGenerator(generatorFilePath);
});
