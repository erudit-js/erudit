import { defineGlobalElement, type ElementSchemaAny } from 'erudit/prose';

export default defineGlobalElement<ElementSchemaAny>({
    name: 'sdf',
    dependencies: {
        mathjax: {
            transpile: true,
        },
    },
});
