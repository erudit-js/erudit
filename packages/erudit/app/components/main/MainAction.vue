<script lang="ts" setup>
import type { MaybeMyIconName } from '#my-icons';

defineProps<{ icon: MaybeMyIconName; label: string; link: string }>();
</script>

<template>
    <section
        class="clear-both grid place-items-center px-(--_pMainX)
            py-[calc(var(--_pMainY)/2)]"
    >
        <EruditLink
            :to="link"
            class="bg-brand gap-small micro:gap-normal px-normal text-main-lg
                shadow-brand/30 micro:h-[55px] hocus:bg-brand/80 flex h-[50px]
                items-center rounded font-bold text-white shadow-lg
                transition-[background]"
        >
            <MaybeMyIcon :name="icon" class="text-[1.1em]" />
            <span>{{ formatText(label) }}</span>
        </EruditLink>
    </section>
</template>
