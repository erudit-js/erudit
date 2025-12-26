export default defineProblemScript({
    uniques: {
        superFormula: BlockMath,
    },
})(({ uniques }) => {
    return {
        problemContent: (
            <>
                <ProblemDescription>Hello World!</ProblemDescription>
                <ProblemHint>
                    <P>This is a hint for the problem.</P>
                </ProblemHint>
                <ProblemHint>
                    <P>Another hint for the problem.</P>
                </ProblemHint>

                <ProblemNote>
                    <P>Общие положения</P>
                    <BlockMath $={uniques.superFormula}>{`
                E = mc^2
            `}</BlockMath>
                    <ProblemSection title='Привет, "мир"!'>
                        Это <A to={$LINK.testPage}>секция</A>{' '}
                        <A to={uniques.superFormula}>внутри</A> заметки.
                    </ProblemSection>
                </ProblemNote>

                <ProblemCheck
                    script
                    label="Корень 1"
                    hint="Не факт, что корень существует"
                />
                <ProblemCheck
                    script
                    label="Корень 2"
                    hint="Не факт, что корень существует"
                />
            </>
        ),
        check: ({ answer, i, answers }) => {
            const correctAnswers = [undefined, '42'];

            if (!correctAnswers.includes(answer)) {
                return false;
            }

            const otherAnswers = Object.values(answers);
            if (otherAnswers.includes(answer)) {
                return false;
            }

            return true;
        },
    };
});
