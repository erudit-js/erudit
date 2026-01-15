export default defineProblemScript({
    isGenerator: true,
})(({ initial }) => {
    const solution = initial ? (
        <>
            <ProblemSolution>Hello World!</ProblemSolution>
        </>
    ) : (
        ''
    );

    return {
        check: ({ answer, name, answers }) => {
            if (name === 'name') {
                return answer === 'Мир';
            }

            if (name === 'num') {
                return answer === '42';
            }

            return false;
        },
        problemContent: (
            <>
                <ProblemDescription>Privet Mir!{''}</ProblemDescription>
                {solution}
                <ProblemCheck label="Имя" script="name" />
                <ProblemCheck label="Число" script="num" />
            </>
        ),
    };
});
