<script lang="ts" setup>
defineProps<{ description: string }>();
const pretty = await useFormatText();
</script>

<template>
    <section :class="$style.contentDescription">
        {{ pretty(description) }}
    </section>
</template>

<style lang="scss" module>
.contentDescription {
    padding: var(--_pMainY) var(--_pMainX);
    font-weight: 500;
    font-size: 1.1em;
    color: var(--text);
}
</style>
