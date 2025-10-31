import el from '#content/3+group-x/3-sub-group/1-sub-page/public/el.mp4';

export default defineProblemGenerator({
    url: import.meta.url,
    initialSeed: 'my-initial-seed',
})(({ random }) => {
    const answer = random.integer(1, 1000);

    return (
        <>
            <ProblemDescription>
                <p>Мое описание проблемы!</p>
                <p>{el}</p>
                {random.boolean() ? <p>Рандом true</p> : <p>Рандом false</p>}
                <BlockMath>E = mc^2</BlockMath>
            </ProblemDescription>
            <ProblemSolution>
                <p>Мое решение проблемы! {random.integer(1, 100) + ''}</p>
            </ProblemSolution>
            <ProblemCheck answer={answer} placeholder={answer + ''} />
        </>
    );
});
