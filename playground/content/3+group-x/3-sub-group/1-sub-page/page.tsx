const fooа = 3;

export const document = createProseDocument({
    url: import.meta.url,
})(() => (
    <blocks>
        <Statement
            title="Мое заявление"
            $snippet={{
                search: { synonyms: ['Пифагор'] },
                description: 'А может и теорема Пифагора',
            }}
        >
            <StatementMain>
                <p>sdfs dd333 11123</p>
                <p>
                    Здесь мы можем писать поэмы, доказывать теоремы и даже
                    обсуждать с Николаем важные дела!
                </p>
                <p>
                    Форализм <b>радько</b> 111!
                </p>
                <p>Абоба тест!</p>
            </StatementMain>
            <StatementProof>
                <p>
                    <b accent={true}>Доказательство</b> sd
                </p>
            </StatementProof>
            <StatementSection title="Заголовок секции">
                <p>Раздел 1</p>
            </StatementSection>
        </Statement>

        <Statement
            title="Мое заявление"
            direction="row"
            $snippet={{
                search: { synonyms: ['Пифагор'] },
                description: 'А может и теорема Пифагора',
            }}
        >
            <StatementMain>
                <p>sdfs dd333 11123</p>
                <p>Форализм радько 111!</p>
                <p>Абоба тест!</p>
            </StatementMain>
            <StatementProof>
                <p>Доказательство sd</p>
            </StatementProof>
            <StatementSection title="Заголовок секции">
                <p>Раздел 1</p>
            </StatementSection>
        </Statement>

        <Term
            title="Мое заявление"
            $snippet={{
                search: { synonyms: ['Пифагор'] },
                description: 'А может и теорема Пифагора',
            }}
        >
            <TermMain>
                <p>sdfs dd333 11123</p>
                <p>Форализм радько!</p>
                <p>Абоба тест!</p>
            </TermMain>
        </Term>

        <h1>Sub Page</h1>
        <p>Мой п</p>
        <p>
            А я<br />
            <br />
            <br />
            истец!!11112
        </p>
        <p>
            Абоба не -- <i>идиот</i>...!{' '}
            <b accent={true}>
                <i>Может</i>
            </b>{' '}
            вы что-нибудь знаете про это?
        </p>
    </blocks>
));
