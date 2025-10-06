import { defineGlobalElement } from '../../globalElement';
import { Span, spanName, type SpanSchema } from '.';

export default defineGlobalElement<SpanSchema>()({
    name: spanName,
    tags: { Span },
});
