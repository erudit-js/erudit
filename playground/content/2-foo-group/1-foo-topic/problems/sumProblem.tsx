export const sumProblem = defineProblemScript({
    isGenerator: true,
})(({ initial, random }) => {
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
                    What is <M>{a}</M> + <M>{b}</M>? Also be sure to{' '}
                    <A to={$LINK.fooGroup.fooTopic}>check this</A> page!
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
        check({ answer }) {
            return answer === String(a + b);
        },
    };
});
