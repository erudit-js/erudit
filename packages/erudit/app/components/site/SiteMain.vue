<template>
    <main
        class="aside1:ps-(--w-aside) aside2:pe-(--w-aside) micro:text-[18px]
            relative px-0 text-[15px] transition-[padding]"
    >
        <div class="text-prose">
            <Preview />
            <div
                class="bg-bg-main py-small min-h-dvh transition-[background]
                    dark:bg-[#212121]"
            >
                <slot></slot>
                <AdsBannerBottom v-if="adsBottomAllowed()" />
            </div>
        </div>
    </main>
</template>
