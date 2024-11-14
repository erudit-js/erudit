<script lang="ts" setup>
import type { MyIconName } from '#my-icons';

defineProps<{
    paneKey: MajorPaneKey;
    icon: MyIconName;
}>();

const { activePane } = useMajorPane();
</script>

<template>
    <button
        @click="activePane = paneKey"
        :class="[
            $style.paneSwtichButton,
            paneKey === activePane ? $style.active : '',
        ]"
    >
        <MyIcon :name="icon" />
    </button>
</template>

<style lang="scss" module>
.paneSwtichButton {
    --_padding: calc(var(--gapSize) / 2);

    position: relative;
    padding: var(--_padding);
    color: var(--textMuted);
    background: transparent;
    border: none;
    cursor: pointer;
    @include transition(color);

    &::after {
        content: '';
        position: absolute;
        left: var(--_padding);
        right: var(--_padding);
        bottom: -1px;
        height: 3px;
        background: transparent;
        @include transition(background);
    }

    &:hover,
    &.active {
        color: var(--text);
        &::after {
            background: var(--border);
        }
    }

    [my-icon] {
        display: grid;
        place-items: center;
        width: var(--buttonSize);
        height: var(--buttonSize);
        font-size: 22px;
    }
}
</style>
