<template>
    <div :class="$style.treeContainer">
        <slot></slot>
    </div>
</template>

<style lang="scss" module>
.treeContainer {
    padding: calc(var(--gap) / 2) 0;
}
</style>
