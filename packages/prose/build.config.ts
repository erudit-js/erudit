import { defineBuildConfig } from 'unbuild';

export default defineBuildConfig({
    entries: [
        {
            builder: 'mkdist',
            input: './src',
            outDir: './dist',
            esbuild: {
                charset: 'utf8',
            },
        },
    ],
    declaration: true,
});
