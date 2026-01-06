<script lang="ts" setup>
defineProps<{
    title: string;
    mediaUrl?: string;
    description?: string;
    link?: {
        href: string;
        external?: boolean;
    };
    color?: string;
}>();
</script>

<template>
    <EruditLink
        :to="link?.href"
        :external="link?.external"
        :target="link?.external ? '_blank' : undefined"
        :style="{
            '--color': color ?? stringColor(title),
            '--colorBorder':
                'color-mix(in srgb, var(--color), var(--color-border) 70%)',
            '--colorBg':
                'color-mix(in srgb, var(--color), var(--color-bg-main) 85%)',
            '--colorText':
                'color-mix(in srgb, var(--color), var(--color-text) 65%)',
            '--colorIcon':
                'color-mix(in srgb, var(--color), var(--color-text) 30%)',
        }"
        :class="[
            `p-small micro:p-normal not-last:mb-normal gap-small text-main-sm
            relative flex w-full break-inside-avoid-column flex-col items-center
            rounded border border-(--colorBorder) bg-linear-to-tr
            from-(--colorBg)/30 to-(--colorBg)
            transition-[background,border,box-shadow]`,
            link && 'hocus:ring-(--colorBorder) ring-2 ring-transparent',
        ]"
    >
        <SmartMedia
            v-if="mediaUrl"
            :url="mediaUrl"
            class="border-bg-main micro:size-[56px] size-[46px] rounded-full
                border-2 [box-shadow:0_0_16px_0_var(--color)]"
        />
        <div class="text-center font-semibold text-(--colorText)">
            {{ formatText(title) }}
        </div>
        <div
            v-if="description"
            class="text-text-muted relative -top-1 text-center"
        >
            {{ formatText(description) }}
        </div>
        <div v-if="$slots.tags" class="gap-small flex flex-wrap justify-center">
            <slot name="tags"></slot>
        </div>
    </EruditLink>
</template>
