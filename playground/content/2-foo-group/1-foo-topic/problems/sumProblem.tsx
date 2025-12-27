export default defineProblemScript({
    isGenerator: true,
    uniques: {
        explanation: Details,
    },
})(({ uniques, initial, random }) => {
    const a = initial ? 2 : random.integer(5, 10);
    const b = initial ? 3 : random.integer(5, 10);

    const hints = random.boolean() ? (
        <>
            <ProblemHint>Это подсказка</ProblemHint>
        </>
    ) : (
        <>
            <ProblemHint>Это подсказка 1!</ProblemHint>
            <ProblemHint>Это подсказка 2!</ProblemHint>
        </>
    );

    return {
        problemContent: (
            <>
                <ProblemDescription>
                    <P>
                        What is <M>{a}</M> + <M>{b}</M>?{' '}
                        <A to={uniques.explanation}>Also be</A> sure to{' '}
                        <A to={$LINK.fooGroup.fooTopic}>check this</A> page!
                    </P>
                    <Details
                        $={uniques.explanation}
                        title="Немного больше инфы"
                    >
                        <BlockMath>{`${a} + ${b} = ${a + b}`}</BlockMath>
                    </Details>
                </ProblemDescription>
                {hints}
                <ProblemNote>Привет</ProblemNote>
                <ProblemCheck
                    label="Контрибуторы?"
                    answers={['Петр', 'Николай']}
                />
                <ProblemCheck script label="Your answer?" />
            </>
        ),
        check({ answer, i, answers }) {
            return answer === String(a + b);
        },
    };
});
