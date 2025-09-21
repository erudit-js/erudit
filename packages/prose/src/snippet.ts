export type JsxElementSnippet = {
    title: string;
    description?: string;
    quick: boolean;
    search: boolean;
    synonyms?: string[];
};

export type JsxPropsSnippet = {
    title?: string;
    description?: string;
    quick?: true;
    search?: true | { synonyms?: string[] };
};
