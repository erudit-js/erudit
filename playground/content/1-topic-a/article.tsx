export default createProseDocument({
    url: import.meta.url,
    uniques: {
        myP: Paragraph,
        myOl: Ul,
    },
})(({ uniques }) => (
    <blocks>
        <h1>My Название моей замечательной статьи!</h1>
        {/*
         *Это комментарий внутри статьи!
         */}
        <p $={uniques.myP} $snippet={{ quick: true, title: 'Futa boy' }}>
            Lol1 Fun boy
        </p>
        <p
            $snippet={{
                search: true,
                title: 'Петр',
                description: 'Описание Петра',
            }}
        >
            Это мой параграф
        </p>
        <Ul $={uniques.myOl}>
            <Li>sdf</Li>
        </Ul>
    </blocks>
));
