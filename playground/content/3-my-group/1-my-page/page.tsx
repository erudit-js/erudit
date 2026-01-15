export const page = definePage({
    title: 'My Page',
    description: 'This is my custom page description.',
    contributions: [
        {
            contributor: $CONTRIBUTOR.KirichenkoAM,
            description: 'Fixed typos and improved explanations.',
        },
        $CONTRIBUTOR.fvm06,
        $CONTRIBUTOR.testContributor1,
        $CONTRIBUTOR.dmitryk,
        $CONTRIBUTOR.gwynerva,
    ],
});

export const content = defineProse()(() => (
    <>
        <P>Пример Мир!</P>
    </>
));
