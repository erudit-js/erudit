<script lang="ts" setup>
import type { MaybeMyIconName } from '#my-icons';

defineProps<{
    level?: number;
    to?: string;
    icon?: MaybeMyIconName;
    main?: string;
    state?: undefined | 'active' | 'accent';
}>();
</script>

<template>
    <EruditLink :to>
        <div
            :style="{ '--level': level ? +level : 0 }"
            :class="[
                'px-normal py-small hocus:bg-neutral-800/8 hocus:dark:bg-neutral-400/8 flex cursor-pointer items-center gap-[calc(var(--spacing-normal)/1.6)] text-sm transition-[background,color]',
                'pl-[calc(var(--spacing-normal)*(var(--level)+1))]',
                {
                    'text-text-muted hocus:text-text': !state,
                    'text-brand': state === 'active',
                    'text-text': state === 'accent',
                },
            ]"
        >
            <MaybeMyIcon
                v-if="icon"
                :name="icon"
                class="h-[calc(1em+.5px)] w-[calc(1em+.5px)] shrink-0"
            />
            <div class="flex-1">{{ main }}</div>
            <div class="shrink-0" v-if="$slots.secondary">
                <slot name="secondary"></slot>
            </div>
        </div>
    </EruditLink>
</template>
