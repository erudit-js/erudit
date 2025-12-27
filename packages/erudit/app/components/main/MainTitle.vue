<script lang="ts" setup>
import type { MaybeMyIconName } from '#my-icons';

const { color = 'var(--color-brand)' } = defineProps<{
    icon: MaybeMyIconName;
    title: string;
    color?: string;
}>();

const formatText = await useFormatText();
</script>

<template>
    <section
        :style="{ '--titleColor': color }"
        class="gap-normal micro:flex-row micro:justify-start flex flex-col
            items-center justify-center px-(--_pMainX)
            py-[calc(var(--_pMainY)/2)]"
    >
        <div
            class="max-micro:rounded-full max-micro:p-4
                max-micro:bg-(--titleColor)/80"
        >
            <MaybeMyIcon
                :name="icon"
                class="max-micro:text-white max-micro:text-[24px] text-[31px]
                    text-[color-mix(in_srgb,var(--titleColor),var(--color-text)_70%)]"
            />
        </div>
        <h1
            class="text-text-deep micro:text-[35px] max-micro:text-center
                text-[30px] leading-tight font-extrabold
                text-shadow-[2px_2px_color-mix(in_srgb,var(--titleColor),transparent_65%)]"
        >
            {{ formatText(title) }}
        </h1>
    </section>
</template>
