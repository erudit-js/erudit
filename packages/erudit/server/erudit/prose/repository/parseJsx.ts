import { parseJsxContent, type JsxElement } from '@erudit-js/prose';
import type { ParsedElement, ElementSchemaAny } from '@erudit-js/prose';
import type { BlocksSchema } from '@erudit-js/prose/default/blocks/index';

export async function parseEruditJsx(
    content: JsxElement<BlocksSchema>,
    step?: (element: ParsedElement<ElementSchemaAny>) => void | Promise<void>,
) {
    return await parseJsxContent({
        content,
        context: {
            language: ERUDIT.config.public.project.language.current,
        },
        step,
    });
}
