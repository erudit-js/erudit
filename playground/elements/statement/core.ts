import { defineEruditProseCoreElements } from '@erudit-js/prose';
import { defineAccentCore } from '@erudit-js/prose/elements/accent/core';

export const statementAccent = defineAccentCore({
    name: 'statement',
    sectionNames: ['proof'],
});

export default defineEruditProseCoreElements(
    { registryItem: statementAccent.accent.registryItem },
    { registryItem: statementAccent.main.registryItem },
    { registryItem: statementAccent.section.registryItem },
);
