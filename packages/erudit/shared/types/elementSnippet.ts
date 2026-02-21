export interface ElementSnippet {
  schemaName: string;
  link: string;
  title: string;
  description?: string;
  key?: {
    title?: string;
    description?: string;
  };
  seo?: {
    title?: string;
    description?: string;
  };
}
