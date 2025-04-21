<template>
    <main :class="$style.main" erudit-main>
        <Preview />
        <div :class="$style.mainInner">
            <slot></slot>
        </div>
    </main>
</template>

<style lang="scss" module>
@use '$/def/bp';

.main {
    --_pMainBase: var(--gapBig);
    --_pMainX: var(--_pMainBase);
    --_pMainY: calc(var(--_pMainBase) / 2);

    position: relative;
    min-height: 100dvh;
    background: var(--bgMain);
    font-size: 18px;

    @include bp.below('mobile') {
        --_pMainBase: var(--_bitran_asideWidth);
        font-size: 14px;
    }

    .mainInner {
        padding: var(--_pMainY) 0;
    }
}
</style>
