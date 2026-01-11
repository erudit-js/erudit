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

    return (
        <>
            <ProblemDescription>Privet Mir!{''}</ProblemDescription>
            {solution}
        </>
    );
});
