import type { EruditLanguageCode } from '@erudit-js/core/eruditConfig/language';

export type LanguageCode = EruditLanguageCode;
export type LanguagePhraseKey = keyof LanguagePhrases;
export type LanguagePhraseValue = string | ((...args: any[]) => string);
export type PayloadLanguagePhraseValue =
  | { type: 'missing' }
  | { type: 'string'; value: string }
  | { type: 'function'; value: string };

export type LanguagePhrases = Phrases<{
  language_code: string;
  language_name: string;
  erudit: string;
  content_nav: string;
  pages: string;
  search: string;
  languages: string;
  settings: string;
  theme: string;
  theme_light: string;
  theme_dark: string;
  theme_system: string;
  built: string;
  content: string;
  add_translation: string;
  main_page: string;
  contributors: string;
  sponsors: string;
  search_the_site: string;
  searching_more: string;
  no_results: string;
  no_more_results: string;
  no_content: string;
  to_index: string;
  about_textbook: string;
  flag_title_dev: string;
  flag_hint_dev: string;
  flag_title_advanced: string;
  flag_hint_advanced: string;
  flag_title_secondary: string;
  flag_hint_secondary: string;
  ads_replacer: string;
  direct_link: string;
  direct_link_explain: string;
  book: string;
  group: string;
  topic: string;
  article: string;
  summary: string;
  practice: string;
  page: string;
  preview_content_page_description: string;
  begin_learning: string;
  flag_dev: string;
  flag_dev_description: string;
  flag_advanced: string;
  flag_advanced_description: string;
  flag_secondary: string;
  flag_secondary_description: string;
  key_elements: string;
  stats: string;
  connections: string;
  need_to_know: string;
  depends_on: string;
  used_by: string;
  externals: string;
  add_quote: string;
  next_quote: string;
  sponsors_description: string;
  become_sponsor: string;
  no_sponsors: string;
  contributors_description: string;
  contributors_invite: string;
  contributor_page_description: (name: string) => string;
  become_contributor: string;
  no_contributors: string;
  contribution: string;
  no_contribution: string;
  editor: string;
  materials: string;
  updated: string;
  x_sponsors: (count: number) => string;
  x_contributors: (count: number) => string;
  news: string;
  no_news: string;
  show_more: string;
  make_contribution: string;
  improve_material: string;
  how_to_improve: string;
  report_issue: string;
  edit_page: string;
  no_toc: string;
  article_seo_description: (contentTitle: string) => string;
  summary_seo_description: (contentTitle: string) => string;
  practice_seo_description: (contentTitle: string) => string;
  externals_own: string;
  externals_from: string;

  default_index_title: string;
  default_index_short: string;
  default_site_info_short: string;
}>;

//
// Utility types for type safety
//

type Phrases<T extends Record<string, LanguagePhraseValue>> = T;
