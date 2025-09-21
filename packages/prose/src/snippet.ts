export type JsxSnippet = {
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

//
//
//

export type ParsedSnippet = JsxSnippet & {
    tagName: string;
    elementName: string;
    domId: string;
};
