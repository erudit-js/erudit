export default defineEruditConfig({
    //contentTargets: ['test', 'zet'],
    debug: {
        log: true,
        slowTransition: true,
        ads: true,
        // fakeApi: {
        //     repository: false,
        // },
    },
    site: {
        buildUrl: 'http://localhost:3000',
        baseUrl: '/subfolder/',
        // logotype: projectPublic('logotype.png'),
        // logotype:
        //     'https://raw.githubusercontent.com/open-math/shared/refs/heads/main/assets/omath.svg',
        // logotype: false,
        title: 'Привет мир',
        // sslogan: 'Тестовый сайт',
        // brandLayout: 'column',
        // favicon: {
        //     article: publicAsset('ava.jpg'),
        // },
        style: {
            brandColor: 'light-dark(#1879d9, #4e94d9)',
        },
    },
    // seo: {
    //     title: 'Открытая математика',
    // },
    // sponsors: {
    //     addLink: 'https://google.com',
    //     tier1Label: 'Помощники',
    //     tier2Label: 'Меценаты',
    //     // defaultCameoMessages: [
    //     //     'Я поддерживаю Открытую Математику!',
    //     //     'Кто в лес, а кто по математике!',
    //     // ],
    // },
    index: {
        logotype: {
            src: projectPublic('index-logo.png'),
            maxWidth: '400px',
            invert: 'dark',
        },
        title: 'Open Erudit',
        slogan: 'Теория, конспекты и задачник в одном флаконе',
        description: `
            Современный учебник по математике — понятный, интересный, подробный.
            Теория, конспекты и задачник в одном флаконе.
            Написано так, чтобы вы во всём смогли разобраться самостоятельно.
            Теория, конспекты и задачник в одном флаконе.
            Написано так, чтобы вы во всём смогли разобраться самостоятельно.
            Никаких сухих перечислений формул и теорем, везде повествовательный подход, чтобы вы понимали, почему и как сформировалось то, что сформировалось.
            Совместно!
        `,
    },
    content: {
        howToImproveLink: 'lol',
    },
    customLinks: [
        {
            label: 'Google',
            href: 'https://google.com',
            icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="M6.5 1.5h-5v5h2v-3h3zm16 0h-5v2h3v3h2zm-4.445 5.841L12 3.845L5.945 7.341L12 10.835zm1.006 1.729L13 12.567v7.01l6.063-3.5zm-8.062 10.507v-7.01l-6.06-3.498l-.002 7.008zM3.5 20.5v-3h-2v5h5v-2zm19 2v-5h-2v3h-3v2z"/></svg>',
        },
        {
            label: 'Telegram',
            href: 'https://t.me/omath_official',
            icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g fill="none" fill-rule="evenodd"><path d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z"/><path fill="currentColor" d="M19.777 4.43a1.5 1.5 0 0 1 2.062 1.626l-2.268 13.757c-.22 1.327-1.676 2.088-2.893 1.427c-1.018-.553-2.53-1.405-3.89-2.294c-.68-.445-2.763-1.87-2.507-2.884c.22-.867 3.72-4.125 5.72-6.062c.785-.761.427-1.2-.5-.5c-2.302 1.738-5.998 4.381-7.22 5.125c-1.078.656-1.64.768-2.312.656c-1.226-.204-2.363-.52-3.291-.905c-1.254-.52-1.193-2.244-.001-2.746z"/></g></svg>',
        },
    ],
    language: {
        current: 'ru',
        translations: {
            ru: {
                name: 'Русский',
                link: 'https://youtube.com',
            },
            en: {
                name: 'English',
                link: 'https://google.com',
            },
        },
        contribute: 'https://github.com',
    },
    repository: {
        type: 'github',
        name: 'nuxt/nuxt',
        branch: 'main',
    },
    analytics: {
        yandex: {
            verification: '986ee9663b1d366b',
            metricsId: '70781320',
        },
    },
    ads: {
        bottom: {
            provider: 'replacer',
            // provider: 'custom',
            // banners: [
            //     {
            //         link: 'https://google.com',
            //         src: 'https://picsum.photos/100/100',
            //     },
            //     {
            //         link: 'https://youtube.com',
            //         src: 'https://picsum.photos/1000/1000',
            //     },
            // ],
        },
        aside: {
            provider: 'replacer',
            // provider: 'custom',
            // banners: {
            //     mobile: [
            //         {
            //             src: projectPublic('logotype.png'),
            //             link: 'https://google.com',
            //         },
            //     ],
            //     full: [
            //         {
            //             src: projectPublic('ava.jpg'),
            //             link: 'https://google.com',
            //         },
            //         {
            //             src: 'https://picsum.photos/300/600',
            //             link: 'https://youtube.com',
            //         },
            //     ],
            // },
        },
    },
    elements: [
        '@erudit-js/prose/elements/math',
        '@erudit-js/prose/elements/diagram',
        './elements/term',
    ],
    nuxtAugmentations: [
        async (nuxt) => {
            //nuxt.options.nitro.preset = 'github-pages';
        },
    ],
});
