import { diagramDeps, mathDeps } from '@erudit-js/bitran-elements';

export default defineEruditConfig({
    //contentTargets: ['test', 'zet'],
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
        //baseUrl: '/subfolder/',
        // logotype: publicAsset('logotype.png'),
        title: 'Привет мир',
        slogan: 'Тестовый сайт',
        // favicon: {
        //     article: publicAsset('ava.jpg'),
        // },
        // style: {
        //     brandColor: 'light-dark(#1879d9, #4e94d9)',
        // },
    },
    // seo: {
    //     title: 'Открытая математика',
    // },
    language: 'ru',
    repository: {
        name: 'open-math/ru.omath.net',
        branch: 'main',
        sharedUrl: 'open-math/shared',
    },
    analytics: {
        yandex: {
            verification: '986ee9663b1d366b',
            metricsId: '70781320',
        },
    },
    ads: {
        bottom: {
            provider: 'custom',
            banners: [
                {
                    link: 'https://google.com',
                    src: 'https://picsum.photos/100/100',
                },
                {
                    link: 'https://youtube.com',
                    src: 'https://picsum.photos/1000/500',
                },
            ],
        },
        aside: {
            provider: 'custom',
            banners: {},
        },
    },
    dependencies: {
        ...mathDeps,
        ...diagramDeps,
    },
});
