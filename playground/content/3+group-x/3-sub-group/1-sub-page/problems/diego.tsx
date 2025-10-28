export default defineProblemGenerator({
    url: import.meta.url,
    initialSeed: 'my-initial-seed',
})(({ random }) => {
    return (
        <>
            <ProblemDescription>
                <p>Мое описание проблемы!</p>
                {random.boolean() ? <p>Рандом true</p> : <p>Рандом false</p>}
                <BlockMath>E = mc^2</BlockMath>
            </ProblemDescription>
        </>
    );
});
