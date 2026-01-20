<script lang="ts" setup>
const { mode = 'detailed' } = defineProps<{
    mode?: 'compact' | 'detailed';
    icon: string;
    label: string;
    count: number;
}>();
</script>

<template>
    <div
        v-if="mode === 'compact'"
        :title="label"
        class="gap-small flex cursor-help items-center"
    >
        <MaybeMyIcon
            :name="icon"
            class="text-text-dimmed -mr-0.5 text-[1.2em]"
        />
        <span class="text-text-muted font-bold">{{ count }}</span>
    </div>
    <div
        v-else
        class="gap-small px-small text-main-sm border-border bg-bg-aside flex
            items-center rounded-xl border py-1"
    >
        <MaybeMyIcon
            :name="icon"
            class="text-text-dimmed -mr-0.5 text-[1.2em]"
        />
        <span class="text-text-muted">{{ label }}</span>
        <span class="text-text-muted font-bold">{{ count }}</span>
    </div>
</template>
