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
        class="gap-small micro:gap-normal micro:flex-row micro:justify-start
            px-main py-main-half not-first:micro:-my-3 not-first:micro:-top-1.5
            relative flex flex-col items-center justify-center"
    >
        <div
            class="max-micro:rounded-full max-micro:p-4
                max-micro:bg-(--titleColor)/80"
        >
            <MaybeMyIcon
                :name="icon"
                class="max-micro:text-white micro:text-[38px] text-[30px]
                    text-[color-mix(in_srgb,var(--titleColor),var(--color-text)_70%)]
                    transition-[color]"
            />
        </div>
        <h1 class="text-size-h1 max-micro:text-center">
            <FancyBold :text="title" :color="color" />
        </h1>
    </section>
</template>
