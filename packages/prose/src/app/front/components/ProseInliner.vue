<script lang="ts" setup>
import type { ParsedElement } from '../../../element';
import type { InlinerSchemaAny } from '../../../schema';

defineProps<{ element: ParsedElement<InlinerSchemaAny> }>();

// TODO: Implement ID anchor highlighting just like in ProseBlock.vue
</script>

<template>
    <span :id="element.domId">
        <slot></slot>
    </span>
</template>
