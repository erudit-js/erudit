<script setup lang="ts">
import type { ParsedElement } from '../../element';
import type { HeadingSchema } from '.';
import ProseBlock from '../../app/front/components/ProseBlock.vue';

defineProps<{ element: ParsedElement<HeadingSchema> }>();
</script>

<template>
    <ProseBlock :element>
        <h1 class="h-[2000px]">Это Заголовок</h1>
    </ProseBlock>
</template>
