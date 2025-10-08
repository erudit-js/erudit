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
                <p>Форализм радько!</p>
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
        <p>Абоба не -- идиот...! Может вы что-нибудь знаете про это?</p>
    </blocks>
));
