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
    generator: 'Generator',
    main_page: 'Main page',
    members: 'Members',
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
    book: 'Book',
    group: 'Group',
    topic: 'Topic',
    article: 'Article',
    summary: 'Summary',
    practice: 'Practice',
    contributor: 'Contributor',
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
    contributors: 'Contributors',
    no_contributors: 'No contributors...',
    make_contribution: 'Make a contribution',
    material_improvement: 'Material improvement',
    how_to_improve: 'How to improve?',
    edit_page: 'Edit page',
    report_problem: 'Report a problem',
    references: 'References',
    reference_source_featured: 'Featured source',
    references_description:
        'List of external sources that were used in writing this material. For a deeper dive into the material, it is recommended to read them in more detail, especially the featured sources, which are marked with an asterisk:',
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
