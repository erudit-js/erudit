<script setup lang="ts">
import type { ParagraphSchema } from '.';
import type { ParsedElement } from '../../element';
import ProseBlock from '../../app/front/components/ProseBlock.vue';
import Render from '../../app/front/components/Render.vue';

defineProps<{ element: ParsedElement<ParagraphSchema> }>();
</script>

<template>
    <ProseBlock>
        <Render v-for="child of element.children" :element="child" />
    </ProseBlock>
</template>
