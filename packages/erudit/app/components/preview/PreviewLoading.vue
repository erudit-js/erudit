<template>
    <div :class="$style.loadingContainer">
        <Loading />
    </div>
</template>

<style lang="scss" module>
.loadingContainer {
    height: 225px;
    display: grid;
    place-items: center;
    font-size: 50px;
}
</style>
