export const phrases: LanguagePhrases = {
  language_code: 'en',
  language_name: 'English',
  erudit: 'Erudit',
  content_nav: 'Content navigation',
  pages: 'Pages',
  search: 'Search',
  languages: 'Languages',
  settings: 'Settings',
  theme: 'Theme',
  theme_light: 'Light',
  theme_dark: 'Dark',
  theme_system: 'System',
  built: 'Built',
  content: 'Content',
  add_translation: 'Add translation',
  main_page: 'Main page',
  contributors: 'Contributors',
  sponsors: 'Sponsors',
  search_the_site: 'Search the site...',
  searching_more: 'Searching more...',
  no_results: 'No results found',
  no_more_results: 'No more results',
  no_content: 'No content.',
  to_index: 'To index',
  about_textbook: 'About textbook',
  flag_title_dev: 'Development',
  flag_hint_dev:
    'This material is not complete, may contain error and will change in the future! Use with caution!',
  flag_title_advanced: 'Advanced',
  flag_hint_advanced:
    'This material is for learners with a high level of knowledge. It contains information that is not suitable for beginners!',
  flag_title_secondary: 'Additional',
  flag_hint_secondary:
    'This is an optional material is for learners who want to dive deeper and gain additional knowledge and context.',
  ads_replacer:
    'We help you. Help us back.<br><strong style="color: inherit;">Disable your ads blocker!</strong>',
  direct_link: 'Direct link',
  direct_link_explain: 'You are about to open a direct link:',
  book: 'Textbook',
  group: 'Category',
  topic: 'Topic',
  article: 'Article',
  summary: 'Summary',
  practice: 'Practice',
  page: 'Page',
  preview_content_page_description: 'You are about to open a content page:',
  begin_learning: 'Begin Learning!',
  flag_dev: 'Development',
  flag_dev_description:
    'This material is in development! It may change in the future and even contain errors!',
  flag_advanced: 'Advanced',
  flag_advanced_description:
    'This material is for learners with a high level of knowledge. It contains information that is not suitable for beginners!',
  flag_secondary: 'Additional',
  flag_secondary_description:
    'This is an optional material is for learners who want to dive deeper and gain additional knowledge and context.',
  key_elements: 'Key elements',
  stats: 'Statistics',
  connections: 'Connections',
  need_to_know: 'Need to know',
  depends_on: 'Depends on',
  used_by: 'Used by',
  externals: 'Externals',
  add_quote: 'Add your own message!',
  next_quote: 'Next quote',
  sponsors_description:
    'List of people and organizations that support the project financially. Thanks to them, the project can exist and develop. If you want to help the project, you can become a sponsor and get on this page too!',
  become_sponsor: 'Become a sponsor',
  no_sponsors: 'There are no sponsors yet. You can be the first one!',
  contributors_description:
    'List of people who contributed to the project materials: suggested valuable ideas, made corrections to existing material or wrote their own!',
  contributors_invite:
    'You can also help the project, make a contribution and get on this page!',
  contributor_page_description: (name: string) =>
    `Personal page of contributor "${name}" with information about their contributions to the project.`,
  become_contributor: 'Become a contributor',
  no_contributors: 'There are no contributors yet. You can be the first one!',
  contribution: 'Contribution',
  no_contribution: 'No contributions yet.',
  editor: 'Editor',
  materials: 'Materials',
  updated: 'Updated',
  x_sponsors: (count: number) => m(count, 'Sponsor', 'Sponsors'),
  x_contributors: (count: number) => m(count, 'Contributor', 'Contributors'),
  news: 'News',
  no_news: 'No news.',
  show_more: 'Show more',
  make_contribution: 'Make a contribution',
  improve_material: 'Improve material',
  how_to_improve: 'How to improve?',
  report_issue: 'Report an issue',
  edit_page: 'Edit page',
  no_toc: 'TOC is empty.',
  article_seo_description: (contentTitle: string) =>
    `Clear and interesting explanation of the topic "${contentTitle}". Clear examples, important terms and statements, interesting facts, life applications.`,
  summary_seo_description: (contentTitle: string) =>
    `Summary of the topic "${contentTitle}": key definitions, theorems, properties and examples of their use. All the most important things in a concise form!`,
  practice_seo_description: (contentTitle: string) =>
    `Various problems with hints and answers on the topic "${contentTitle}". Interesting conditions, hints and detailed solutions. Turn knowledge into a skill!`,
  externals_own: 'Own',
  externals_from: 'From',

  default_index_title: 'Erudit',
  default_index_short: 'Modern digital textbooks!',
  default_site_info_short: 'Modern textbook',
};

export function m(
  number: number,
  one: string,
  few: string,
  includeNumber = true,
) {
  const text = number === 1 ? one : few;
  return includeNumber ? `${number} ${text}` : text;
}
