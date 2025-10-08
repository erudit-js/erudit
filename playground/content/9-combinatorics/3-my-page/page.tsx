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
        <h1>Заголовок моей страницы</h1>
        <p $snippet={{ search: true, title: 'Первый параграф моей страницы!' }}>
            Первый{' '}
            <b>
                sdfds <i>параграф</i>
            </b>{' '}
            <b>моей</b> страницы!
        </p>
    </blocks>
));
