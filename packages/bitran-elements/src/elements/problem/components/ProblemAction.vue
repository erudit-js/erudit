<script lang="ts" setup>
defineProps<{ active?: boolean; icon: string; label: string }>();
</script>

<template>
    <button :class="{ [$style.problemAction]: true, [$style.active]: active }">
        <MyRuntimeIcon name="problem-action-icon" wrapper="span" :svg="icon" />
        {{ label }}
    </button>
</template>

<style lang="scss" module>
@use '@bitran-js/renderer-vue/scss/utils' as bitranUtils;

.problemAction {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 5px 8px;
    min-width: 50px;
    font-size: 0.8em;
    background: var(--bgMain);
    border-radius: 5px;
    text-align: center;
    font-weight: 600;
    color: var(--bitran_textMuted);
    border: 1px solid
        color-mix(in srgb, var(--bitran_colorBorder), var(--bgAside) 50%);
    box-shadow: 0 1px 3px light-dark(rgba(black, 0.08), rgba(white, 0.05));
    cursor: pointer;

    @include bitranUtils.transition(background, color, border-color);

    &:hover,
    &.active {
        color: var(--bitran_colorBrand);
        border-color: color-mix(
            in srgb,
            var(--bitran_colorBrand),
            var(--bitran_colorBorder) 80%
        );
    }

    &.active {
        background: color-mix(
            in srgb,
            var(--bitran_colorBrand),
            var(--bgMain) 90%
        );
    }
}
</style>
