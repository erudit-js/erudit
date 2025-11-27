import myShady from './shady.jpg';

export default defineContributor({
    displayName: 'Пётр Радько',
    slogan: 'Гениями не рождаются — ими становятся!',
    editor: true,
    links: {
        Telegram: 'https://t.me/kolobok',
        GitHub: 'sdfsd',
    },
    description: (
        <>
            <P>
                Привет! Меня зовут Пётр Радько, я фронтенд-разработчик из
                России.
            </P>
            <Image src={myShady} />
        </>
    ),
});
