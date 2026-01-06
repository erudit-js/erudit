<script lang="ts" setup>
import type { MaybeMyIconName } from '#my-icons';

const { color = 'var(--color-brand)' } = defineProps<{
    icon: MaybeMyIconName;
    title: string;
    color?: string;
}>();
</script>

<template>
    <section
        :style="{ '--titleColor': color }"
        class="gap-normal micro:flex-row micro:justify-start flex flex-col
            items-center justify-center px-(--_pMainX)
            py-[calc(var(--_pMainY)/2)] pt-0"
    >
        <div
            class="max-micro:rounded-full max-micro:p-4
                max-micro:bg-(--titleColor)/80"
        >
            <MaybeMyIcon
                :name="icon"
                class="max-micro:text-white micro:text-[38px] text-[30px]
                    text-[color-mix(in_srgb,var(--titleColor),var(--color-text)_70%)]"
            />
        </div>
        <h1 class="text-size-h1 max-micro:text-center">
            <FancyBold :text="title" :color="color" />
        </h1>
    </section>
</template>
