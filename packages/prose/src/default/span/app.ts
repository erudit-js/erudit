import { defineAppElement } from '../../app';
import { ElementType } from '../../type';
import { spanName, type SpanSchema } from '.';

export default defineAppElement<SpanSchema>({
    type: ElementType.Inliner,
    name: spanName,
    component: () => import('./Span.vue'),
    languages: {
        en: () => import('./languages/en'),
        ru: () => import('./languages/ru'),
    },
});
