import tali from '#content/combinatorics/my-page/tali.jpg';

export default definePage({
    title: 'Моя страница. Ура!',
    description: 'Описание моей страницы',
    flags: {
        advanced: true,
        dev: true,
    },
});

export const document = createProseDocument({
    url: import.meta.url,
})(() => (
    <blocks>
        <p center serif>
            Алалия
        </p>
        <h1>Заголовок моей страницы</h1>
        <p $snippet={{ search: true, title: 'Первый параграф моей страницы!' }}>
            Первый{' '}
            <b>
                sdfds <i>параграф</i>
            </b>{' '}
            <b>моей</b> страницы!
        </p>
        <Diagram>
            {`
                flowchart TB
                    A & B--> C & D
            `}
            <Caption>Пример диаграммы потока</Caption>
        </Diagram>

        <Image src={tali} />

        <Problem title="Моя первая задача" level="medium" applied>
            <ProblemDescription>
                <p>Содержимое</p>
            </ProblemDescription>
        </Problem>

        <Problems title="Много задач" level="hard" pretty>
            <p>Общее условие</p>
            <SubProblem>
                <ProblemDescription>
                    <p>Первый подзадача</p>
                </ProblemDescription>
            </SubProblem>
            <SubProblem label="Вторая">
                <ProblemDescription>
                    <p>Вторая подзадача</p>
                </ProblemDescription>
            </SubProblem>
        </Problems>
    </blocks>
));
