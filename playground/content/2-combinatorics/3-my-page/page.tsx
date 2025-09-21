export default definePage({
    title: 'My Page',
    description: 'This is my custom page in the combinatorics section.',
});

export const document = createProseDocument({
    url: import.meta.url,
    content: () => (
        <blocks>
            <p>Lol</p>
        </blocks>
    ),
});
