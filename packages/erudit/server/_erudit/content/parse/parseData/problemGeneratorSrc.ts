import {
    type ParsedElement,
    type ElementSchemaAny,
    isElement,
} from '@erudit-js/prose';
import { Problem } from '@erudit-js/prose/elements/problem/problem.global';
import { SubProblem } from '@erudit-js/prose/elements/problem/problems.global';

export async function tryAddProblemGeneratorSrc(
    contentFullId: string,
    element: ParsedElement<ElementSchemaAny>,
) {
    if (isElement(element, Problem) || isElement(element, SubProblem)) {
        const generatorPath = element.data.generatorPath;
        if (generatorPath) {
            await ERUDIT.db
                .insert(ERUDIT.db.schema.contentParseData)
                .values({
                    fullId: contentFullId,
                    type: 'problemGeneratorSrc',
                    value: generatorPath,
                })
                .onConflictDoNothing();
        }
    }
}
