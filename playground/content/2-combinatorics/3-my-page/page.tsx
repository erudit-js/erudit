export default definePage({
    title: 'My Page',
    description: 'This is my custom page in the combinatorics section.',
});

export const document = createProseDocument({
    url: import.meta.url,
    content: () => (
        <blocks>
            <p
                $snippet={{
                    search: {
                        synonyms: ['funny', 'haha'],
                    },
                    title: 'My Lol 111',
                    description: 'Lol description',
                }}
            >
                Lol
            </p>
            <Ol $snippet={{ title: 'My Ol List', search: true }}>
                <Li>First item</Li>
            </Ol>
        </blocks>
    ),
});
