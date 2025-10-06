export const document = createProseDocument({
    url: import.meta.url,
})(() => (
    <blocks>
        <Statement
            $snippet={{
                search: { synonyms: ['Пифагор'] },
                title: 'Мое заявление',
                description: 'А может и теорема Пифагора',
            }}
        >
            <StatementMain>
                <p>sdfs</p>
            </StatementMain>
        </Statement>
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
