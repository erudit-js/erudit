export default definePage({
    title: 'My Page',
});

export const document = createProseDocument({
    url: import.meta.url,
    content: () => (
        <blocks>
            <p>Lol</p>
        </blocks>
    ),
});
