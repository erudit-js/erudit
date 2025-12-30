export default defineGroup({
    title: 'Foo Group',
    description: 'This is a foo group for demonstration purposes.',
    flags: {
        dev: true,
    },
    externals: [
        {
            type: 'site',
            title: 'Wikipedia - Combinatorics',
            link: 'https://en.wikipedia.org/wiki/Combinatorics',
            reason: 'A broad overview of combinatorial topics and links to further resources.',
        },
    ],
});
