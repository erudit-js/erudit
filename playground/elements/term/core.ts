import { defineEruditProseCoreElements } from '@erudit-js/prose';
import { defineAccent } from '@erudit-js/prose/elements/accent/core';

const termAccent = defineAccent({
    name: 'term',
    sectionNames: [],
});

export default defineEruditProseCoreElements(
    { registryItem: termAccent.accent.registryItem },
    { registryItem: termAccent.main.registryItem },
    { registryItem: termAccent.section.registryItem },
);
