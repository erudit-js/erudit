<template>
    <Transition name="EruditTransitionFade">
        <slot></slot>
    </Transition>
</template>

<style lang="scss">
.EruditTransitionFade {
    &-enter-active,
    &-leave-active {
        transition: opacity var(--transitionSpeed) var(--transitionFunction);
    }

    &-enter-from,
    &-leave-to {
        opacity: 0;
    }
}
</style>
