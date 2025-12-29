<template>
    <main
        class="aside1:ps-(--w-aside) aside2:pe-(--w-aside) micro:text-[18px]
            relative px-0 text-[15px] transition-[padding]"
    >
        <!-- Добавить блок "Зависимости" в начале каждой страницы.
 Там выводятся автоматически полученные зависимости, а также блок "СТРОГИЕ ЗАВИСИМОСТИ", которые задаются вручную
 СТРОГИЕ ЗАВИСИМОСТИ -- это зависимости, которые необходимо знать, чтобы понять материал на этой странице!

-->

        <div class="text-main" data-erudit-main>
            <Preview />
            <div
                class="bg-bg-main min-h-dvh py-(--_pMainY)
                    transition-[background] dark:bg-[#212121]"
            >
                <slot></slot>
                <AdsBannerBottom v-if="adsBottomAllowed()" />
            </div>
        </div>
    </main>
</template>
