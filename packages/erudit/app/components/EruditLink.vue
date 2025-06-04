<script lang="ts" setup>
const props = defineProps<{
    to?: string;
    prefetch?: boolean;
}>();

const EruditLink = defineNuxtLink({
    prefetch: props.prefetch ?? true,
    trailingSlash: 'append',
});
</script>

<template>
    <EruditLink :to="props.to">
        <slot></slot>
    </EruditLink>
</template>
