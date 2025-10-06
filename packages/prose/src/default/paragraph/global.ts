import { defineGlobalElement } from '../../globalElement';
import { type ParagraphSchema, paragraphName, Paragraph } from '.';

export default defineGlobalElement<ParagraphSchema>()({
    name: paragraphName,
    tags: { Paragraph },
});
