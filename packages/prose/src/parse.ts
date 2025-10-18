import type { ProseContext } from './context';
import { type BlocksSchema } from './default/blocks';
import type { JsxElement, ParsedElement } from './element';
import type { ElementSchemaAny } from './schema';
import { slugify } from './slugify';
import type { ParsedSnippet } from './snippet';

export interface ParsedJsxContent {
    parsedTree: ParsedElement<BlocksSchema>;
    uniques: Record<string, ParsedElement<ElementSchemaAny>>;
    snippets: ParsedSnippet[];
}

export async function parseJsxContent(argObj: {
    content: JsxElement<BlocksSchema>;
    context: ProseContext;
}): Promise<ParsedJsxContent> {
    const { content, context } = argObj;
    const ids = new Map<string, undefined>();
    const uniques: Record<string, ParsedElement<ElementSchemaAny>> = {};
    const snippets: ParsedSnippet[] = [];

    async function parseElement<TSchema extends ElementSchemaAny>(
        jsxElement: JsxElement<TSchema>,
    ): Promise<ParsedElement<TSchema>> {
        await tryTitleToSlug(jsxElement, context);

        let transformedChildren: ParsedElement<any>[] | undefined = undefined;
        if (jsxElement.children) {
            transformedChildren = [];
            for (const child of jsxElement.children as JsxElement<any>[]) {
                if (child) {
                    const transformedChild = await parseElement(child);
                    transformedChildren.push(transformedChild);
                }
            }
        }

        const parsedElement: ParsedElement<TSchema> = {
            domId: createDomId(ids, jsxElement),
            type: jsxElement.type,
            name: jsxElement.name,
            storageKey: jsxElement.storageKey,
            data: jsxElement.data,
            children: transformedChildren as any,
        };

        if (jsxElement.title) {
            parsedElement.title = jsxElement.title;
        }

        if (jsxElement.uniqueSlug) {
            parsedElement.uniqueSlug = jsxElement.uniqueSlug;
        }

        if (!parsedElement.domId) {
            delete parsedElement.domId;
        }

        if (jsxElement.uniqueSlug) {
            uniques[jsxElement.uniqueSlug] = parsedElement;
        }

        if (jsxElement.snippet) {
            snippets.push({
                ...jsxElement.snippet,
                tagName: jsxElement.tagName,
                elementName: jsxElement.name,
                domId: parsedElement.domId!,
            });
        }

        return parsedElement;
    }

    return {
        parsedTree: await parseElement(content),
        uniques,
        snippets,
    };
}

/**
 * If JSX element has a `data.title` field (headings, accent blocks, problems, etc), use it to create
 * a slug that allows to understand the content of the element from its URL. This is useful for SEO and accessibility.
 */
async function tryTitleToSlug(
    jsxElement: JsxElement<ElementSchemaAny>,
    context: ProseContext,
) {
    if (jsxElement.title) {
        jsxElement.slug ||= await slugify(jsxElement.title, context.language);
    }
}

/**
 * Creates a document-level unique identifier for JSX element using slug if possible.
 */
function createDomId(
    ids: Map<string, undefined>,
    jsxElement: JsxElement<ElementSchemaAny>,
): string | undefined {
    if (!jsxElement.linkable) {
        return undefined;
    }

    let baseId = jsxElement.slug ?? jsxElement.name + '-' + jsxElement.hash;
    let dedupe = 0;
    let domId = baseId;

    while (ids.has(domId)) {
        dedupe++;
        domId = `${baseId}-${dedupe}`;
    }

    ids.set(domId, undefined);

    return domId;
}
