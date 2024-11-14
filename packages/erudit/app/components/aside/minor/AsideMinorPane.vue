<template>
    <div :class="$style.asideMinorPane">
        <slot></slot>
    </div>
</template>

<style lang="scss" module>
.asideMinorPane {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
}
</style>
