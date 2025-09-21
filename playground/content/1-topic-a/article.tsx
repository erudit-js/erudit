export default createProseDocument({
    url: import.meta.url,
    uniques: {
        myP: Paragraph,
        myOl: Ul,
    },
    content: ({ uniques }) => (
        <blocks>
            <h1>My Название моей замечательной статьи!</h1>
            {/*
             *Это комментарий внутри статьи!
             */}
            <p $={uniques.myP} $snippet={{ quick: true, title: 'Futa boy' }}>
                Lol1 Fun boy
            </p>
            <Ul $={uniques.myOl}>
                <Li>sdf</Li>
            </Ul>
        </blocks>
    ),
});
