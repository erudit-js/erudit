import { defineEruditProseCoreElements } from '@erudit-js/prose';
import { defineAccentCore } from '@erudit-js/prose/elements/accent/core';

export const termAccent = defineAccentCore({
    name: 'term',
    sectionNames: ['bar'],
});

export default defineEruditProseCoreElements(
    { registryItem: termAccent.accent.registryItem },
    { registryItem: termAccent.main.registryItem },
    { registryItem: termAccent.section.registryItem },
);
