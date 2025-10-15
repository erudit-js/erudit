import { defineGlobalElement } from '../../globalElement';
import {
    inlinerMathName,
    M,
    tryParseMathString,
    type InlinerMathSchema,
} from './inliner';
import { latexToHtml } from './katex';

export default defineGlobalElement<InlinerMathSchema>()({
    name: inlinerMathName,
    tags: { M },
    async createStorageData(element) {
        const tokens = tryParseMathString(element.data.katex);

        if (tokens) {
            return tokens;
        }

        return {
            type: 'katext',
            mathHtml: await latexToHtml(element.data.katex, 'inline'),
        };
    },
});
