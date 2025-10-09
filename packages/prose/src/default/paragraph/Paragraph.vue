<script setup lang="ts">
import type { ParagraphSchema } from '.';
import type { ParsedElement } from '../../element';
import ProseBlock from '../../app/front/components/ProseBlock.vue';
import Render from '../../app/front/components/Render.vue';

defineProps<{ element: ParsedElement<ParagraphSchema> }>();
</script>

<template>
    <ProseBlock :element>
        <div
            :class="[
                'break-words transition-[color]',
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
    </ProseBlock>
</template>
