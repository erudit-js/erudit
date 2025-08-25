<script lang="ts" setup>
const { direction = 'forward' } = defineProps<{
    direction: 'forward' | 'backward';
}>();

const transitionClasses = computed(() => {
    const isForward = direction !== 'backward';
    return {
        enterFrom: isForward ? 'translate-x-full' : '-translate-x-full',
        enterActive: 'transition-transform',
        enterTo: 'translate-x-0',
        leaveFrom: 'translate-x-0',
        leaveActive: 'transition-transform',
        leaveTo: isForward ? '-translate-x-full' : 'translate-x-full',
    };
});
</script>

<template>
    <Transition
        :enter-from-class="transitionClasses.enterFrom"
        :enter-active-class="transitionClasses.enterActive"
        :enter-to-class="transitionClasses.enterTo"
        :leave-from-class="transitionClasses.leaveFrom"
        :leave-active-class="transitionClasses.leaveActive"
        :leave-to-class="transitionClasses.leaveTo"
    >
        <slot></slot>
    </Transition>
</template>
