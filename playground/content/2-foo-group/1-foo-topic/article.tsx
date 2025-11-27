export default defineDocument({
    uniques: {
        myP: P,
    },
})(({ uniques }) => (
    <>
        <H1>Foo Article</H1>
        <P $={uniques.myP}>This is a foo article.</P>
    </>
));

export const myScript = defineProblemScript()(() => (
    <>
        <ProblemDescription>Здесь мой путь и кончается</ProblemDescription>
    </>
));
