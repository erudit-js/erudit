<script lang="ts" setup>
import type { FlexSchema } from '.';
import type { ParsedElement } from '../../element';
import ProseBlock from '../../app/front/components/ProseBlock.vue';
import Render from '../../app/front/components/Render.vue';

const { element } = defineProps<{ element: ParsedElement<FlexSchema> }>();

const justify = (() => {
    return element.data.justifyContent ?? 'center';
})();

const gap = (() => {
    return element.data.gap ?? 'var(--spacing-big)';
})();
</script>

<template>
    <ProseBlock :element>
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
    </ProseBlock>
</template>
