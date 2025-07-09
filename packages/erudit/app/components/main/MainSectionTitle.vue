<script lang="ts" setup>
import { isMyIcon, type MyIconName } from '#my-icons';

defineProps<{
    icon: string;
    title: string;
    count?: number | string;
}>();

const pretty = useFormatText();
</script>

<template>
    <h2 :class="$style.heading">
        <MyIcon
            v-if="isMyIcon(icon)"
            :name="icon as MyIconName"
            :class="$style.icon"
        />
        <MyRuntimeIcon v-else name="section-title-icon" :svg="icon" />
        <span :class="$style.title">{{ pretty(title) }}</span>
        <span v-if="count !== undefined" :class="$style.count">
            {{ count }}
        </span>
    </h2>
</template>

<style lang="scss" module>
.heading {
    display: flex;
    align-items: center;
    gap: var(--gap);
    padding: var(--_pMainY) var(--_pMainX);

    .icon {
        font-size: 0.9em;
        color: var(--textMuted);
    }

    .count {
        position: relative;
        top: 1px;
        font-weight: 550;
        font-size: 0.6em;
        background: color-mix(in srgb, var(--textDimmed), transparent 65%);
        border-radius: 20px;
        padding: 2px 10px;
    }
}
</style>
