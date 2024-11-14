<script lang="ts" setup>
const props = defineProps<{ stick?: 'top' | 'bottom' }>();
const style = useCssModule();

const classes = computed(() => {
    const _classes: string[] = [style.asideOverlayPane];

    if (props.stick === 'bottom') _classes.push(style.stickBottom);

    return _classes;
});
</script>

<template>
    <section :class="classes">
        <slot></slot>
    </section>
</template>

<style lang="scss" module>
@use '$/def/bp';

.asideOverlayPane {
    position: absolute;
    z-index: 10;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: var(--bgAside);

    display: flex;
    flex-direction: column;
    justify-content: start;

    &.stickBottom {
        justify-content: end;
    }
}
</style>
