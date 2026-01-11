<script lang="ts" setup>
import {
    inlinersSchema,
    mixSchema,
    textSchema,
    type AnySchema,
    type ProseElement,
} from '@jsprose/core';
import { paragraphSchema } from '@erudit-js/prose/elements/paragraph/core';

import Mix from './elements/Mix.vue';
import P from './elements/P.vue';
import Text from './elements/Text.vue';
import { refSchema } from '@erudit-js/prose/elements/link/reference/core';
import Ref from './elements/Ref.vue';

const { element } = defineProps<{ element: ProseElement<AnySchema> }>();

const ElementComponent = (() => {
    switch (element.schemaName) {
        case textSchema.name:
            return Text;
        case paragraphSchema.name:
            return P;
        case refSchema.name:
            return Ref;
        case mixSchema.name:
        case inlinersSchema.name:
            return Mix;
        default:
            return h(
                'span',
                { class: 'text-red-500 font-semibold font-mono' },
                `<${element.schemaName} />`,
            );
    }
})();
</script>

<template>
    <ElementComponent v-if="element" :element />
</template>
