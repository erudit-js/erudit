const russian: EruditPhrases = {
    _language_title: 'Русский',
    _language_code: 'ru',

    site_info_title: 'Erudit',
    site_info_slogan: 'Современный учебник',
    seo_index_title: 'Erudit - CMS для образовательных сайтов',
    seo_index_description:
        'Erudit — CMS для создания и управления идеальными образовательными сайтами, которые поддерживаются сообществом.',
    seo_article_description: (contentTitle) =>
        `Понятное и интересное объяснение темы «${contentTitle}». Показательные примеры, важные свойства, интересные факты, применение в жизни, понятные доказательства. Здесь вы точно разберетесь!`,
    seo_summary_description: (contentTitle) =>
        `Конспект темы «${contentTitle}»: ключевые определения, теоремы, свойства и примеры их использвания. Все самое важное и в кратком виде!`,
    seo_practice_description: (contentTitle) =>
        `Разнообразные задачи с подсказками и ответами по теме «${contentTitle}». Интересные условия, подсказки и подробные решения. Превратите знания в навык!`,
    index: 'Оглавление',
    pages: 'Страницы',
    search: 'Поиск',
    language: 'Язык',
    other: 'Другое',
    ads_replacer:
        'Помогите нам улучшать проект.<br><strong>Включите показ рекламы!</strong>',
    theme: 'Тема',
    theme_system: 'Системная',
    theme_light: 'Светлая',
    theme_dark: 'Темная',
    content: 'Контент',
    generator: 'Генератор',
    main_page: 'Главная страница',
    members: 'Участники',
    add_translation: 'Добавить перевод',
    empty_nav: 'Пустая навигация',
    flag_dev: 'Разработка',
    flag_dev_description:
        'Этот материал в разработке! Он может измениться в будущем и даже содержать ошибки!',
    flag_advanced: 'Профиль',
    flag_advanced_description:
        'Этот материал предназначен для учеников с высоким уровнем понимания предмета. Информация здесь не предназначена для новичокв!',
    flag_secondary: 'Дополнение',
    flag_secondary_description:
        'Это дополнительный материал для тех, кто хочет глубже погрузиться предмет и получить дополнительные знания и контекст.',
    popover_dependencies: 'Зависимости',
    popover_dependencies_description:
        'Царского пути в эту тему нет! Вы сможете разобраться только если знаете следующие темы:',
    to_index: 'К оглавлению',
    about_book: 'Об учебнике',
    close: 'Закрыть',
    back: 'Назад',
    goto: 'Перейти',
    error: 'Ошибка!',
    external_link: 'Внешняя ссылка',
    external_link_warn: 'Вы собираетесь перейти на внешний ресурс!',
    internal_link: 'Внутренняя ссылка',
    internal_link_warn: 'Вы собираетесь перейти на внутреннюю страницу сайта!',
    book: 'Книга',
    group: 'Группа',
    topic: 'Тема',
    article: 'Статья',
    summary: 'Конспект',
    practice: 'Задачи',
    contributor: 'Автор',
    element_id: 'ID элемента',
    preview_missing_title: 'Элемент не найден!',
    preview_missing_explain:
        'Не удалось найти на этой странице элемент с указанным ID!<br>Возможно, ID элемента указан неправильно или элемент был изменен/удален.',
    preview_missing_explain_mismatch: `Не удалось найти на этой странице элемент с указанным ID!<br>Версия страницы, на которую вела ссылка, отличается от текущей версии страницы!<br>Скорее всего, именно это и является причиной ошибки.`,
    preview_hash_mismatch_title: 'Несовпадение версий страницы!',
    preview_hash_mismatch_explain:
        'Версия страницы, которую вы видите сейчас отличается от версии страницы, на которую вела исходная ссылка!<br>Содержимое может отличаться от того, что вы ожидали увидеть.',
    current_page_hash: 'Текущий хеш',
    expected_page_hash: 'Ожидаемый хеш',
    empty_toc: 'Пустая таблица содержимого...',
    contributors: 'Авторы',
    no_contributors: 'Авторов нет...',
    make_contribution: 'Внести свой вклад',
    material_improvement: 'Улучшение материала',
    how_to_improve: 'Как улучшить?',
    edit_page: 'Редактировать страницу',
    report_problem: 'Сообщить о проблеме',
    references: 'Источники',
    reference_source_featured: 'Избранный источник',
    references_description:
        'Список внешних источников, которые использовались при написании этого материала. Для более глубокого погружения в материал рекомендуются ознакомиться с ними подробнее, особенно с избранными источниками, которые отмечены звездочкой:',
};

export default russian;

export function m(
    number: number,
    one: string,
    two: string,
    five: string,
    includeNumber = true,
) {
    const text = [five, one, two, two, two, five][
        number % 100 > 10 && number % 100 < 20 ? 0 : Math.min(number % 10, 5)
    ];
    return includeNumber ? `${number} ${text}` : text;
}
