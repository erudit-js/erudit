const ru: LanguagePhrases = {
    language_code: 'ru',
    language_name: 'Русский',
    erudit: 'Erudit',
    content_nav: 'Оглавление',
    pages: 'Страницы',
    search: 'Поиск',
    languages: 'Языки',
    settings: 'Настройки',
    theme: 'Тема',
    theme_light: 'Светлая',
    theme_dark: 'Темная',
    theme_system: 'Системная',
    built: 'Собрано',
    content: 'Контент',
    add_translation: 'Добавить перевод',
    main_page: 'Главная страница',
    contributors: 'Авторы',
    sponsors: 'Спонсоры',
    search_the_site: 'Поиск по сайту...',
    searching_more: 'Ищем еще...',
    no_results: 'Ничего не найдено',
    no_more_results: 'Больше результатов нет',
    no_content: 'Контента нет.',
    to_index: 'К оглавлению',
    about_textbook: 'Об учебнике',
    flag_title_dev: 'Разработка',
    flag_hint_dev:
        'Этот материал не завершен, может содержать ошибки и измениться в будущем! Используйте с осторожностью!',
    flag_title_advanced: 'Профиль',
    flag_hint_advanced:
        'Этот материал предназначен для учеников с хорошим уровнем понимания предмета. Информация здесь не предназначена для новичков!',
    flag_title_secondary: 'Дополнение',
    flag_hint_secondary:
        'Это материал для тех, кто хочет глубже погрузиться предмет и получить дополнительные знания и контекст.',
    ads_replacer:
        'Помогите улучшить проект.<br><strong style="color: inherit;">Включите показ рекламы!</strong>',
    direct_link: 'Прямая ссылка',
    direct_link_explain: 'Вы собираетесь открыть прямую ссылку:',
    book: 'Учебник',
    group: 'Категория',
    topic: 'Тема',
    article: 'Статья',
    summary: 'Конспект',
    practice: 'Задачи',
    page: 'Страница',
    preview_content_page_description:
        'Вы собираетесь перейти на страницу контента:',
    begin_learning: 'Начать изучение!',
    flag_dev: 'Разработка',
    flag_dev_description:
        'Этот материал в разработке! Он может измениться в будущем и даже содержать ошибки!',
    flag_advanced: 'Профиль',
    flag_advanced_description:
        'Этот материал предназначен для учеников с высоким уровнем понимания предмета. Информация здесь не предназначена для новичков!',
    flag_secondary: 'Дополнение',
    flag_secondary_description:
        'Это дополнительный материал для тех, кто хочет глубже погрузиться предмет и получить дополнительные знания и контекст.',
    key_elements: 'Ключевые элементы',
    stats: 'Статистика',
    connections: 'Связи',
    need_to_know: 'Надо знать',
    depends_on: 'Зависит от',
    used_by: 'Используется в',
    externals: 'Внешние',
    add_quote: 'Добавить свое сообщение!',
    next_quote: 'Следующая цитата',
    sponsors_description:
        'Список людей и организаций, которые поддерживают проект финансово. Благодаря им проект может существовать и развиваться. Если вы хотите помочь проекту, то тоже можете стать спонсором и попасть на эту страницу!',
    become_sponsor: 'Стать спонсором',
    no_sponsors: 'Пока что спонсоров нет. Вы можете стать первым!',
    contributors_description:
        'Список людей, которые внесли вклад в материалы проекта: предложили ценные идеи, вносили корректировки в существующий материал или же написали собственный!',
    contributors_invite:
        'Вы тоже можете помочь проекту, внести свой вклад и попасть на эту страницу!',
    contributor_page_description: (name: string) =>
        `Персональная страница автора "${name}" с данными о вкладе в проект.`,
    become_contributor: 'Стать автором',
    no_contributors: 'Пока что авторов нет. Вы можете стать первым!',
    contribution: 'Вклад',
    no_contribution: 'Пока что вклада нет.',
    editor: 'Редактор',
    materials: 'Материалы',
    x_sponsors: (count: number) => m(count, 'Спонсор', 'Спонсора', 'Спонсоров'),
    x_contributors: (count: number) => m(count, 'Автор', 'Автора', 'Авторов'),
    news: 'Новости',
    no_news: 'Новостей нет.',
    show_more: 'Показать больше',
    make_contribution: 'Внести свой вклад',
    improve_material: 'Улучшить материал',
    how_to_improve: 'Как улучшить?',
    report_issue: 'Сообщить о проблеме',
    edit_page: 'Редактировать страницу',
    no_toc: 'Содержание пусто.',
    article_seo_description: (contentTitle: string) =>
        `Понятное и интересное объяснение темы «${contentTitle}». Показательные примеры, важные свойства, интересные факты, применение в жизни, понятные доказательства. Здесь вы точно разберетесь!`,
    summary_seo_description: (contentTitle: string) =>
        `Конспект темы «${contentTitle}»: ключевые определения, теоремы, свойства и примеры их использвания. Все самое важное и в кратком виде!`,
    practice_seo_description: (contentTitle: string) =>
        `Разнообразные задачи с подсказками и ответами по теме «${contentTitle}». Интересные условия, подсказки и подробные решения. Превратите знания в навык!`,
    externals_own: 'Собственные',
    externals_from: 'Из',

    default_index_title: 'Erudit',
    default_index_short: 'Современные цифровые учебники!',
    default_site_info_short: 'Современный учебник',
};

export default ru;

export function m(
    number: number,
    one: string,
    two: string,
    five: string,
    includeNumber = true,
) {
    const text = [five, one, two, two, two, five][
        number % 100 > 10 && number % 100 < 20 ? 0 : Math.min(number % 10, 5)
    ]!;
    return includeNumber ? `${number} ${text}` : text;
}
