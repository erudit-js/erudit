const english: EruditPhrases = {
    _language_title: 'English',
    _language_code: 'en',

    site_info_title: 'Erudit',
    site_info_slogan: 'Modern textbook',
    seo_index_title: 'Erudit - CMS for eductional sites',
    seo_index_description:
        'Erudit is a CMS for creating and managing perfect educational sites, maintained by the community.',
    seo_article_description: (contentTitle) =>
        `Clear and interesting explanation of the topic "${contentTitle}". Illustrative examples, important properties, interesting facts, life applications, clear proofs. Here you will definitely understand the topic!`,
    seo_summary_description: (contentTitle) =>
        `Summary of the topic "${contentTitle}": key definitions, theorems, properties and examples of their use. All the most important things in a concise form!`,
    seo_practice_description: (contentTitle) =>
        `Various problems with hints and answers on the topic "${contentTitle}". Interesting conditions, hints and detailed solutions. Turn knowledge into a skill!`,
    index: 'Index',
    pages: 'Pages',
    search: 'Search',
    language: 'Language',
    other: 'Other',
    ads_replacer:
        'Help us develop the project.<br><strong>Disable your ads blocker!</strong>',
    theme: 'Theme',
    theme_system: 'System',
    theme_light: 'Light',
    theme_dark: 'Dark',
    content: 'Content',
    main_page: 'Main page',
    contributors: 'Contributors',
    contributors_page_description:
        'List of people who contributed to the project materials: suggested valuable ideas, made corrections to existing material or wrote their own!',
    contributors_page_invite:
        'You can also help the project, make a contribution and get on this page!',
    become_contributor: 'Become a contributor',
    contributor: 'Contributor',
    contribution: 'Contribution',
    contributions_explain: (count) =>
        `Contributed to ${m(count, 'material', 'materials')}`,
    contributor_description: (name) =>
        `Page with information about the contributor "${name}" and his contribution to the project.`,
    editor: 'Editor',
    add_translation: 'Add translation',
    empty_nav: 'Empty navigation',
    flag_dev: 'Development',
    flag_dev_description:
        'This material is in development! It may change in the future and even contain errors!',
    flag_advanced: 'Advanced',
    flag_advanced_description:
        'This material is for learners with a high level of knowledge. It contains information that is not suitable for beginners!',
    flag_secondary: 'Additional',
    flag_secondary_description:
        'This is an optional material is for learners who want to dive deeper and gain additional knowledge and context.',
    popover_dependencies: 'Dependencies',
    popover_dependencies_description:
        'There is no royal way into this topic! You can only figure it out if you know the following topics:',
    to_index: 'To index',
    about_book: 'About book',
    close: 'Close',
    back: 'Back',
    goto: 'Go to',
    error: 'Error!',
    external_link: 'External link',
    external_link_warn: 'You are going to visit external resource!',
    internal_link: 'Internal link',
    internal_link_warn: 'You are going to visit internal site page!',
    book: 'Textbook',
    group: 'Group',
    topic: 'Topic',
    topics: 'Topics',
    article: 'Article',
    summary: 'Summary',
    practice: 'Practice',
    element_id: 'Element ID',
    preview_missing_title: 'Element not found!',
    preview_missing_explain: `Can't find the element with specified ID in this page!<br>Perhaps the element ID is specified incorrectly or the element has been changed/deleted.`,
    preview_missing_explain_mismatch: `Can't find the element with specified ID in this page!<br>The version of the linked page is different from the current version of the page!<br>This is most likely the cause of the error.`,
    preview_hash_mismatch_title: 'Page version mismatch!',
    preview_hash_mismatch_explain:
        'The version of the page you see now is different from the version of the page the original link led to!<br>The content may be different from what you expected to see.',
    current_page_hash: 'Current hash',
    expected_page_hash: 'Expected hash',
    empty_toc: 'Empty table of contents...',
    no_contributors: 'No contributors...',
    make_contribution: 'Make a contribution',
    material_improvement: 'Material improvement',
    how_to_improve: 'How to improve?',
    edit_page: 'Edit page',
    report_problem: 'Report a problem',
    references: 'References',
    reference_source_featured: 'Featured source',
    references_description:
        'A list of external sources that were used to write this material. If there is an asterisk next to the title, it is a featured source and is worth reading if you want to delve deeper into the material.',
    sponsors: 'Sponsors',
    sponsors_description:
        'People and organizations that support the project financially. Thanks to them, we can continue to develop the project and improve the quality of materials. If you want to support the project, you can become a sponsor too!',
    become_sponsor: 'Become a sponsor',
    toc: 'Table of contents',
    mentions: (count) => m(count, 'mention', 'mentions'),
    start_learning: 'Start learning!',
    x_contributors: (count) => m(count, 'Contributor', 'Contributors'),
    x_sponsors: (count) => m(count, 'Sponsor', 'Sponsors'),
};

export default english;

export function m(
    number: number,
    one: string,
    few: string,
    includeNumber = true,
) {
    const text = number === 1 ? one : few;
    return includeNumber ? `${number} ${text}` : text;
}
