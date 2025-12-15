<script lang="ts" setup>
import type { ProseElement } from '@jsprose/core';

import type { flexSchema } from './core.js';
import Block from '../../app/shared/block/Block.vue';
import Render from '../../app/shared/Render.vue';

const { element } = defineProps<{ element: ProseElement<typeof flexSchema> }>();

const justify = (() => {
    return element?.data?.justifyContent ?? 'center';
})();

const gap = (() => {
    return element?.data?.gap ?? 'var(--spacing-big)';
})();
</script>

<template>
    <Block :element>
        <div
            :style="{ justifyContent: justify, gap }"
            class="flex flex-wrap items-center"
        >
            <template v-for="item of element.children">
                <div>
                    <Render :element="item" />
                </div>
            </template>
        </div>
    </Block>
</template>
