import tali from '#content/9-combinatorics/3-my-page/tali.jpg';

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

        <Problem title="Моя первая задача" level="hard" applied pretty>
            <ProblemDescription>
                <p>Содержимое. Может даже с формулой:</p>
                <BlockMath>A^2 + B^2 = C^2</BlockMath>
            </ProblemDescription>
            <ProblemHint>
                <p>Подсказка к задаче</p>
            </ProblemHint>
            <ProblemHint>
                <p>Вторая подсказка к задаче</p>
            </ProblemHint>
            <ProblemNote>
                <p>Заметочка Небольшая</p>
            </ProblemNote>
            <ProblemSolution>
                <BlockMath>f(x) = a \in R</BlockMath>
                <ProblemSection title="Часть 1">
                    <p>Решение, часть 1</p>
                </ProblemSection>
            </ProblemSolution>
            <ProblemAnswer>
                <ProblemSection title="Ответ">
                    <p>42</p>
                </ProblemSection>
            </ProblemAnswer>
            <ProblemCheck
                answer="fargus"
                placeholder="Ответ тута"
                label="Студия локализации"
                hint="Ответ текстовый"
            />
            <ProblemCheck answers={[1, 2, 3]} />
        </Problem>

        <Problems title="Много задач" level="example" method>
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
                <ProblemHint>
                    <p>Подсказка ко второй подзадаче</p>
                </ProblemHint>
            </SubProblem>
            <SubProblem>
                <ProblemDescription>
                    <p>Третья подзадача</p>
                </ProblemDescription>
            </SubProblem>
        </Problems>
    </blocks>
));
