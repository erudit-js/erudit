<script lang="ts" setup>
import type { MyIconName } from '#my-icons';

const { type, active } = defineProps<{
    type: 'hardDependencies' | 'autoDependencies' | 'dependents' | 'externals';
    active?: boolean;
    count?: number;
}>();

const isHard = type === 'hardDependencies';

const phrase = await usePhrases(
    'need_to_know',
    'depends_on',
    'used_by',
    'externals',
);

const title = (() => {
    switch (type) {
        case 'hardDependencies':
            return phrase.need_to_know;
        case 'autoDependencies':
            return phrase.depends_on;
        case 'dependents':
            return phrase.used_by;
        case 'externals':
            return phrase.externals;
    }
})();

const icon: MyIconName = (() => {
    switch (type) {
        case 'hardDependencies':
            return 'warning';
        case 'autoDependencies':
            return 'arrow/to-circle';
        case 'dependents':
            return 'arrow/from-circle';
        case 'externals':
            return 'arrow/outward-box';
    }
})();

const dynamicClasses = computed(() => {
    if (isHard) {
        if (active) {
            return 'border-(--activeColor) text-(--activeColor) bg-(--activeColor)/10 hocus:ring-(--activeColor)/25';
        } else {
            return 'border-border bg-bg-aside text-text-muted hocus:ring-(--activeColor)/25 hocus:text-(--activeColor) hocus:border-(--activeColor)';
        }
    }

    if (active) {
        return 'border-(--activeColor) text-(--activeColor) bg-(--activeColor)/10 hocus:ring-(--activeColor)/25';
    } else {
        return 'border-border bg-bg-aside text-text-muted hocus:ring-(--activeColor)/25 hocus:text-(--activeColor) hocus:border-(--activeColor)';
    }
});
</script>

<template>
    <button
        :style="{
            '--activeColor': isHard
                ? 'light-dark(var(--color-red-700),var(--color-red-400))'
                : 'var(--color-brand)',
        }"
        :class="[
            `gap-small text-main-sm px-small flex cursor-pointer items-center
            rounded border py-1 ring-2 ring-transparent
            transition-[border,color,box-shadow,background]`,
            dynamicClasses,
        ]"
    >
        <MyIcon :name="icon" class="text-[1.2em]" />
        <span>{{ formatText(title) }}</span>
        <span v-if="count" class="font-bold">{{ count }}</span>
        <slot name="after"></slot>
    </button>
</template>
