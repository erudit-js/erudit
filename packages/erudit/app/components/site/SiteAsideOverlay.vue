<script lang="ts" setup>
//
// This overlay is needed to prevent accident link/image/button clicks when user just wants to close opened aside.
//

const asideState = useAsideState();

function overlayClick() {
    asideState.value.opened = undefined;
    // Allow switches to immediately reappear if nothing else prevents it
    asideState.value.scrolledUp = true;
}
</script>

<template>
    <div
        class="fixed top-0 left-0 z-20 h-dvh w-dvh"
        v-if="asideState.opened"
        @click="overlayClick"
    ></div>
</template>
