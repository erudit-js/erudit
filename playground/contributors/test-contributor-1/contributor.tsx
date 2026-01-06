import myShady from './shady.jpg';

export default defineContributor({
    displayName: 'Пётр Радько',
    short: 'Гениями не рождаются — ими становятся!',
    editor: true,
    links: {
        Telegram: 'https://t.me/kolobok',
        GitHub: 'https://github.com',
    },
    description: (
        <>
            <P>
                Привет! Меня зовут Пётр Радько, я фронтенд-разработчик из
                России.
            </P>
            <Image src={myShady} width="400px" />
        </>
    ),
});
