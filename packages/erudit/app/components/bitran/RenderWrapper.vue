<script lang="ts" setup>
defineProps<{ mode: 'hybrid' | 'client' }>();
</script>

<template>
    <slot v-if="mode !== 'client'"></slot>
    <ClientOnly v-else>
        <slot></slot>
    </ClientOnly>
</template>
