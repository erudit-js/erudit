<script lang="ts" setup>
import { inject, ref, watch } from 'vue';
import { useIcon } from '../../composables/icon';
import { proseContextSymbol } from '../../composables/appContext';

const { icon, title } = defineProps<{
    icon: string;
    title: string;
    brand?: boolean;
}>();

const Icon = useIcon();
const { TransitionFade } = inject(proseContextSymbol)!;

const key = ref(0);
watch(
    () => [icon, title],
    () => {
        key.value++;
    },
);
</script>

<template>
    <button
        :class="[
            `cursor-pointer px-(--asideMenuGapBig) py-(--asideMenuGap) text-left
            text-xs transition-[color,background]`,
            brand
                ? 'text-brand bg-brand/10'
                : 'hocus:bg-bg-accent text-text-muted hocus:text-text',
        ]"
    >
        <TransitionFade mode="out-in">
            <div
                :key
                class="flex flex-wrap items-center gap-(--asideMenuGapBig)"
            >
                <Icon :name="icon" class="shrink-0" />
                <div>{{ title }}</div>
            </div>
        </TransitionFade>
    </button>
</template>
