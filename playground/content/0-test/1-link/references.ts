export default defineContentReferences([
    {
        source: {
            featured: true,
            type: 'book',
            title: '"Комбинаторика"',
            description:
                'Виленкин Н.Я., Виленкин А.Н., "Виленкин" П.А., 7-е издание, МЦНМО, 2019',
            comment:
                'Почти идеальная подача "теории" через жизненные примеры. Интересные задачи. Широчайший охват тем, в том числе и из высшей математики.',
        },
        references: [
            { title: '23. Сочетания без повторений' },
            { title: '28. "Спортлото"' },
            {
                title: 'Финальные задачи к главе II',
                description: 'Задачи с 85 по 92',
            },
        ],
    },
    {
        source: {
            featured: true,
            type: 'site',
            link: 'https://nuxt.com/',
            title: 'Nuxt',
            description:
                'An open source framework that makes web development intuitive and powerful.',
            comment: 'Erudit is built on top of Nuxt!',
        },
        references: [
            { title: 'Main page', link: 'https://nuxt.com/' },
            {
                title: 'Documentation',
                link: 'https://nuxt.com/docs/getting-started/introduction',
                description: 'Pay attention to the ending',
            },
        ],
    },
]);
