<template>
    <main :class="$style.main" erudit-main>
        <ClientOnly>
            <Preview />
        </ClientOnly>
        <div :class="$style.mainInner">
            <slot></slot>
        </div>
    </main>
</template>

<style lang="scss" module>
@use '$/def/bp';
@use '@bitran-js/renderer-vue/scss/def' as bitranDef;

.main {
    --_pMainBase: var(--gapBig);
    --_pMainX: var(--_pMainBase);
    --_pMainY: calc(var(--_pMainBase) / 2);

    position: relative;
    min-height: 100dvh;
    background: var(--bgMain);
    font-size: 18px;

    @include bp.below('mobile') {
        --_pMainBase: #{bitranDef.$asideWidth};
        font-size: 15px;
    }

    .mainInner {
        padding: var(--_pMainY) 0;
    }
}
</style>
