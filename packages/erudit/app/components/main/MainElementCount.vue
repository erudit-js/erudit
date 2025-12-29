<script lang="ts" setup>
const { schemaName } = defineProps<{ schemaName: string; count: number }>();

const elementIcon = await getElementIcon(schemaName);
const elementPhrase = await getElementPhrase(schemaName);
</script>

<template>
    <div
        class="gap-small px-small text-main-sm border-border bg-bg-aside flex
            items-center rounded-xl border py-1
            transition-[background,color,border]"
    >
        <MaybeMyIcon :name="elementIcon" class="text-text-dimmed" />
        <span class="text-text-muted">{{ elementPhrase.element_name }}</span>
        <span class="text-text-muted font-bold">{{ count }}</span>
    </div>
</template>
