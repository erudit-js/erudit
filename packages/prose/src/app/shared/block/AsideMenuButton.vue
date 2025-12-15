<script lang="ts" setup>
import { ref, watch } from 'vue';

import { useProseContext } from '../../composables/context.js';

const { icon, title } = defineProps<{
    icon: string;
    title: string;
    brand?: boolean;
}>();

const { EruditIcon, EruditTransition } = useProseContext();

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
            `relative cursor-pointer text-left text-xs
            transition-[color,background]`,
            brand
                ? 'text-brand bg-brand/10'
                : 'hocus:bg-bg-accent text-text-muted hocus:text-text',
        ]"
    >
        <div
            class="pointer-events-none invisible flex touch-none flex-wrap
                items-center gap-(--asideMenuGapBig) px-(--asideMenuGapBig)
                py-(--asideMenuGap)"
        >
            <EruditIcon :name="icon" class="shrink-0" />
            <div>{{ title }}</div>
        </div>
        <EruditTransition>
            <div
                :key
                class="absolute top-0 left-0 flex flex-wrap items-center
                    gap-(--asideMenuGapBig) px-(--asideMenuGapBig)
                    py-(--asideMenuGap)"
            >
                <EruditIcon :name="icon" class="shrink-0" />
                <div>{{ title }}</div>
            </div>
        </EruditTransition>
    </button>
</template>
