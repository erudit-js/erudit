<script lang="ts" setup>
defineProps<{ description: string; html?: boolean }>();
const pretty = useFormatText();
</script>

<template>
    <section
        v-if="html"
        :class="$style.contentDescription"
        v-html="description"
    ></section>
    <section v-else :class="$style.contentDescription">
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
