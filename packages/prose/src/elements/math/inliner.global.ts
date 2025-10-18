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

        let mathHtml = '<span style="color: red">KaTeX Error!</span>';
        try {
            mathHtml = await latexToHtml(element.data.katex, 'inline');
        } catch (error) {
            console.error('Error while rendering math:', error);
        }

        return {
            type: 'katext',
            mathHtml,
        };
    },
});
