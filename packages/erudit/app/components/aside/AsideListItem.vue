<script lang="ts" setup>
import type { MaybeMyIconName } from '#my-icons';

const { to, hoverable = true } = defineProps<{
    to?: string;
    icon?: MaybeMyIconName;
    main?: string;
    secondary?: string | number;
    active?: boolean;
    hoverable?: boolean;
}>();

const isExternalLink = computed(() => {
    return to?.startsWith('http');
});
</script>

<template>
    <EruditLink
        :class="[
            `border-border block min-h-(--h-min-aside-item) border-b
            bg-transparent text-sm transition-[background,color]`,
            hoverable && 'hocus:bg-bg-accent cursor-pointer',
            active
                ? 'text-brand'
                : ['text-text-muted', hoverable && 'hocus:text-text'],
        ]"
        :to
    >
        <slot>
            <div
                class="gap-normal px-normal flex min-h-(--h-min-aside-item)
                    items-center"
            >
                <MaybeMyIcon
                    v-if="icon"
                    :name="icon"
                    class="shrink-0 text-[23px]"
                />
                <slot name="icon" v-else-if="$slots.icon"></slot>

                <span v-if="main" class="relative">
                    {{ main }}
                    <MyIcon
                        v-if="isExternalLink"
                        name="arrow/outward"
                        class="text-text-dimmed absolute -top-[1px]
                            -right-[16px] text-xs"
                    />
                </span>
                <slot name="main" v-else-if="$slots.main"></slot>

                <span
                    v-if="secondary"
                    :class="[
                        'text-text-dimmed text-xs font-[500]',
                        isExternalLink && 'ps-[5px]',
                    ]"
                >
                    {{ secondary }}
                </span>
                <slot name="secondary" v-else-if="$slots.secondary"></slot>
            </div>
        </slot>
    </EruditLink>
</template>
