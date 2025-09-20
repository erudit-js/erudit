export default createProseDocument({
    url: import.meta.url,
    uniques: {
        myP: Paragraph,
        myOl: Ul,
    },
    content: ({ uniques }) => (
        <blocks>
            <h1>Название моей замечательной статьи!</h1>
            <p $={uniques.myP}>Lol1 Fun boy</p>
            <Ul $={uniques.myOl}>
                <Li>Fobar</Li>
            </Ul>
        </blocks>
    ),
});
