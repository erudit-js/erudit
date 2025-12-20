//
// Дать возможность как-то создавать анонимные или локальные uniques для кроссылок внутри одной задачи?
// Им даются уникальные ID в рамках документа, но без пересечений с uniques?
// Потому что uniques в скрипт проблемы мы наверное не передадим...
// Или передадим?
//
// Тогда на поверхности надо будет вот так делать script={myScript(unique1, unique2)}?
//

//
// Внутридокументные анонимные ссылки (передаем напрямую rawElement из этого же документа в <A> тег)
//

// Финальная идея:
//
// Можно создавать анонимные uniques, которые не связаны с uniques defineDocument.
// Это получаются такие локальные uniques, на которые невозможно сослаться из других документов.
// И ссылку на них можно сделать только передав саму unique в <A> тег.
//

export const myScript = defineProblemScript({
    initialSeed: 'aboba',
    isGenerator: true,
})(() => (
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
            <BlockMath>{`
                E = mc^2
            `}</BlockMath>
            <ProblemSection title='Привет, "мир"!'>
                <P>Это секция внутри заметки.</P>
            </ProblemSection>
        </ProblemNote>

        <ProblemCheck answer={42} label="Какой ответ?" />
    </>
));
