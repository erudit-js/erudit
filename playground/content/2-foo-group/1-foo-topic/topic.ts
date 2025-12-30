export default defineTopic({
    title: 'Foo Topic',
    description: `
        This is the Foo Topic description.
        Не сказать, что я прямо очень рад этому.
        Но все равно статья будет полезной для очень большого количества людей!
    `,
    contributors: [$CONTRIBUTOR.KirichenkoAM],
    flags: {
        secondary: true,
        advanced: true,
    },
    externals: [
        {
            type: 'physical',
            title: 'Combinatorial Mathematics',
            info: 'A comprehensive guide to combinatorial principles and applications.',
            reason: 'Great amount of problems to practice combinatorial concepts.',
        },
    ],
});
