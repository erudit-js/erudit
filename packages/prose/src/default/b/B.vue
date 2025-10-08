<script lang="ts" setup>
import type { BSchema } from '.';
import type { ParsedElement } from '../../element';
import Render from '../../app/front/components/Render.vue';

defineProps<{ element: ParsedElement<BSchema> }>();
</script>

<template>
    <strong
        :class="[
            'font-medium transition-[color]',
            element.data?.accent
                ? 'text-[var(--accentText,var(--color-text-deep))]'
                : 'text-text-deep',
        ]"
    >
        <Render v-for="child of element.children" :element="child" />
    </strong>
</template>
