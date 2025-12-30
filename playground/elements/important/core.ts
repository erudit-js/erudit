import { defineEruditProseCoreElements } from '@erudit-js/prose';
import { defineAccentCore } from '@erudit-js/prose/elements/accent/core';

export const importantAccent = defineAccentCore({
    name: 'important',
    sectionNames: [],
});

export default defineEruditProseCoreElements(
    { registryItem: importantAccent.accent.registryItem },
    { registryItem: importantAccent.main.registryItem },
);
