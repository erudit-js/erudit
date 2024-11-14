<template>
    <div :class="$style.navBookLoading">
        <Loading />
    </div>
</template>

<style lang="scss" module>
.navBookLoading {
    position: absolute;
    z-index: 100;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: var(--bgAside);

    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 60px;

    @include transition(opacity, box-shadow);
}
</style>
