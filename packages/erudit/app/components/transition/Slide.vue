<script lang="ts" setup>
const styles = useCssModule();

const { direction = 'forward' } = defineProps<{
    direction: 'forward' | 'backward';
}>();

function setTransition(el: Element) {
    el.classList.add(styles.slideTransition);
}

const transitionClasses = computed(() => {
    const isForward = direction !== 'backward';
    return {
        enterFrom: isForward ? 'translate-x-full' : '-translate-x-full',
        enterTo: 'translate-x-0',
        leaveFrom: 'translate-x-0',
        leaveTo: isForward ? '-translate-x-full' : 'translate-x-full',
    };
});
</script>

<template>
    <Transition
        :enter-from-class="transitionClasses.enterFrom"
        :enter-to-class="transitionClasses.enterTo"
        :leave-from-class="transitionClasses.leaveFrom"
        :leave-to-class="transitionClasses.leaveTo"
        @before-enter="setTransition"
        @after-enter="setTransition"
        @enter-cancelled="setTransition"
        @before-leave="setTransition"
        @after-leave="setTransition"
        @leave-cancelled="setTransition"
    >
        <slot></slot>
    </Transition>
</template>

<style module>
.slideTransition {
    transition-property: translate;
    transition-duration: var(--default-transition-duration);
    transition-timing-function: var(--default-transition-timing-function);
    backface-visibility: hidden;
}
</style>
