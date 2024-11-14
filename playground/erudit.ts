// import { transpile } from 'omath-bitran';

export default defineEruditConfig({
    debug: {
        log: true,
        slowTransition: true,
        fakeApi: {
            repository: true,
            languages: true,
        },
    },
    site: {
        buildUrl: 'http://localhost:3000',
        // baseUrl: '/subfolder/',
        // logotype: publicAsset('logotype.png'),
        title: 'Привет мир',
        slogan: 'Тестовый сайт',
        // favicon: {
        //     article: publicAsset('ava.jpg'),
        // },
    },
    seo: {
        title: 'Открытая математика',
    },
    language: 'en',
    repository: {
        name: 'math-ok/ru.omath.net',
        branch: 'main',
        sharedUrl: 'math-ok/shared',
    },
    ads: {
        leftBlockId: 'R-A-2185026-3',
        bottomBlockId: 'R-A-2185026-1',
    },
});
