<template>
    <main
        class="aside1:ps-(--w-aside) aside2:pe-(--w-aside) relative px-0 transition-[padding]"
    >
        <Preview />
        <div
            class="bg-bg-main py-small min-h-dvh transition-[background] dark:bg-[#212121]"
        >
            <slot></slot>
            <AdsBannerBottom v-if="adsBottomAllowed()" />
        </div>
    </main>
</template>
