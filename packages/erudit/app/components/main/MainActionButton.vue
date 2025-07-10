<script setup lang="ts">
import type { MyIconName } from '#my-icons';

defineProps<{
    icon: MyIconName;
    label: string;
    link: string;
}>();
</script>

<template>
    <section :class="$style.actionButtonSection">
        <EruditLink
            :prefetch="false"
            :to="link"
            :target="link.startsWith('/') ? undefined : '_blank'"
            :class="$style.actionButton"
        >
            <MyIcon :name="icon" :class="$style.actionButtonIcon" />
            <span :class="$style.actionButtonLabel">{{ label }}</span>
        </EruditLink>
    </section>
</template>

<style lang="scss" module>
.actionButtonSection {
    position: relative;
    z-index: 10;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: var(--_pMainY) var(--_pMainX);
}

.actionButton {
    display: flex;
    align-items: center;
    gap: 10px;
    color: white;
    text-decoration: none;
    font-weight: 600;
    background: var(--brand);
    border-radius: 5px;
    padding: 12px 20px;
    box-shadow: 0 0 14px 1px color-mix(in srgb, var(--brand), transparent 60%);

    @include transition(background);

    &:hover {
        background: color-mix(in srgb, var(--brand), transparent 25%);
    }
}
</style>
