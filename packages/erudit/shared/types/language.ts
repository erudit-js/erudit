export interface EruditPhrases {
    _language_title: string;
    _language_code: string;

    site_info_title: string;
    site_info_slogan: string;
    seo_index_title: string;
    seo_index_description: string;
    seo_article_description: (contentTitle: string) => string;
    seo_summary_description: (contentTitle: string) => string;
    seo_practice_description: (contentTitle: string) => string;
    index: string;
    pages: string;
    search: string;
    language: string;
    other: string;
    ads_replacer: string;
    theme: string;
    theme_system: string;
    theme_light: string;
    theme_dark: string;
    content: string;
    main_page: string;
    contributors: string;
    contributors_page_description: string;
    contributors_page_invite: (link: string) => string;
    contributor: string;
    contribution: string;
    contributions_explain: (count: number) => string;
    contributor_description: (name: string) => string;
    editor: string;
    add_translation: string;
    empty_nav: string;
    flag_dev: string;
    flag_dev_description: string;
    flag_advanced: string;
    flag_advanced_description: string;
    flag_secondary: string;
    flag_secondary_description: string;
    popover_dependencies: string;
    popover_dependencies_description: string;
    to_index: string;
    about_book: string;
    close: string;
    back: string;
    goto: string;
    error: string;
    external_link: string;
    external_link_warn: string;
    internal_link: string;
    internal_link_warn: string;
    book: string;
    group: string;
    topic: string;
    article: string;
    summary: string;
    practice: string;
    element_id: string;
    preview_missing_title: string;
    preview_missing_explain: string;
    preview_missing_explain_mismatch: string;
    preview_hash_mismatch_title: string;
    preview_hash_mismatch_explain: string;
    current_page_hash: string;
    expected_page_hash: string;
    empty_toc: string;
    no_contributors: string;
    make_contribution: string;
    material_improvement: string;
    how_to_improve: string;
    edit_page: string;
    report_problem: string;
    references: string;
    reference_source_featured: string;
    references_description: string;
}

export type EruditPhraseId = keyof Partial<EruditPhrases>;
export type EruditPhrase = EruditPhrases[keyof EruditPhrases];
