<script lang="ts" setup>
const styles = useCssModule();

function setTransition(el: Element) {
  el.classList.add(styles.fadeTransition);
}
</script>

<template>
  <Transition
    enter-from-class="opacity-0"
    leave-to-class="opacity-0"
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
.fadeTransition {
  transition-property: opacity;
  transition-duration: var(--default-transition-duration);
  transition-timing-function: var(--default-transition-timing-function);
}
</style>
