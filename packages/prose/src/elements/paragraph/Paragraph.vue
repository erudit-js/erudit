<script setup lang="ts">
import type { ProseElement } from '@jsprose/core';

import type { paragraphSchema } from './core';
import Block from '../../app/shared/Block.vue';
import Render from '../../app/shared/Render.vue';

defineProps<{ element: ProseElement<typeof paragraphSchema> }>();
</script>

<template>
    <Block :element>
        <div
            :class="[
                'wrap-break-word transition-[color]',
                element.data?.center
                    ? 'text-center'
                    : 'micro:text-justify text-left',
                {
                    'font-serif': element.data?.serif,
                },
            ]"
        >
            <Render v-for="child of element.children" :element="child" />
        </div>
    </Block>
</template>
