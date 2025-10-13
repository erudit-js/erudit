<script lang="ts" setup>
import { h, inject, type Component } from 'vue';

import type { ParsedElement } from '../../../element';
import type { ElementSchemaAny } from '../../../schema';
import { useProseAppContext } from '../composables/appContext';
import { blocksName } from '../../../default/blocks/index';

// Default Renderers
import Blocks from '../../../default/blocks/Blocks.vue';
import { textName } from '../../../default/text';
import Text from '../../../default/text/Text.vue';
import { brName } from '../../../default/br';
import Br from '../../../default/br/Br.vue';
import { bName } from '../../../default/b';
import B from '../../../default/b/B.vue';
import { iName } from '../../../default/i';
import I from '../../../default/i/I.vue';
import { linkName } from '../../../default/link';
import Link from '../../../default/link/Link.vue';

const { element } = defineProps<{
    element: ParsedElement<ElementSchemaAny>;
}>();

const { appElements } = useProseAppContext();

const RenderComponent: Component<{ element: ParsedElement<ElementSchemaAny> }> =
    await (async () => {
        const appElement = appElements[element.name];

        if (appElement) {
            const Component = await appElement.component();
            return Component;
        }

        switch (element.name) {
            case blocksName:
                return Blocks;
            case textName:
                return Text;
            case brName:
                return Br;
            case bName:
                return B;
            case iName:
                return I;
            case linkName:
                return Link;
        }

        return {
            render() {
                return h('div', `Unknown element: ${element.name}`);
            },
        };
    })();
</script>

<template>
    <RenderComponent :element />
</template>
