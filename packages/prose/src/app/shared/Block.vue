<script lang="ts" setup>
import type { AnySchema, ProseElement } from '@jsprose/core';

defineProps<{ element: ProseElement<AnySchema> }>();
</script>

<template>
    <div>Block</div>
</template>
