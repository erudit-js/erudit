<script lang="ts" setup>
import { h, type Component } from 'vue';
import {
    inlinersSchema,
    mixSchema,
    textSchema,
    type AnySchema,
    type ProseElement,
} from '@jsprose/core';

import { useAppElement } from '../composables/appElement.js';
import Mix from '../default/Mix.vue';
import Inliners from '../default/Inliners.vue';
import Text from '../default/Text.vue';

const { element } = defineProps<{ element: ProseElement<AnySchema> }>();

const ElementComponent: Component = await (async () => {
    switch (element.schemaName) {
        case mixSchema.name:
            return Mix;
        case inlinersSchema.name:
            return Inliners;
        case textSchema.name:
            return Text;
    }

    try {
        const appElement = useAppElement(element);
        return await appElement.component();
    } catch (error) {
        console.warn(
            `[Prose] [Render] Missing component for element schema: ${element.schemaName}`,
        );

        return {
            render() {
                return h(
                    'span',
                    { class: 'text-red-500 font-semibold font-mono' },
                    `<${element.schemaName}/>`,
                );
            },
        };
    }
})();
</script>

<template>
    <ElementComponent :element />
</template>
