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
    --_pMainX: 30px;
    --_pMainY: 18px;

    position: relative;
    min-height: 100dvh;
    background: var(--bgMain);
    font-size: 18px;

    @include bp.below('mobile') {
        --_pMainX: 18px;
        --_pMainY: 14px;
        font-size: 15px;
    }

    .mainInner {
        padding: var(--_pMainY) 0;
    }
}
</style>
