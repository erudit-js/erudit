<script lang="ts" setup>
import type { MyIconName } from '#my-icons';

defineProps<{
    icon: MyIconName;
    link?: string;
    brand?: boolean;
}>();

const nuxtLink = defineNuxtLink({ prefetch: false, trailingSlash: 'append' });
</script>

<template>
    <component
        :is="link ? nuxtLink : 'button'"
        :to="link || null"
        :class="[$style.uiAction, brand && $style.brand]"
        target="_blank"
    >
        <MyIcon :name="icon" />
    </component>
</template>

<style lang="scss" module>
@use '$/partials/preview';

.uiAction {
    --size: 40px;

    display: flex;
    align-items: center;
    justify-content: center;

    width: var(--size);
    height: var(--size);

    border: none;
    border-radius: 3px;
    background: transparent;

    color: var(--textMuted);
    font-size: 22px;
    text-decoration: none;

    @include transition(color, background, opacity);

    &:hover,
    &:active {
        cursor: pointer;
        color: var(--textColor);
        background: var(--bgAccent);

        @include preview.hasTheme() {
            background: color-mix(
                in srgb,
                var(--_previewThemeText),
                var(--bgAccent) 85%
            );
        }

        &.brand {
            //color: color-mix(in srgb, var(--brand), black 20%);
            background: color-mix(in srgb, var(--brand), transparent 80%);
        }
    }

    //

    &.brand {
        color: var(--brand);
    }
}
</style>
