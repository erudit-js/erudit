<template>
    <main
        class="aside1:ps-(--w-aside) aside2:pe-(--w-aside) micro:text-[18px]
            relative px-0 text-[15px] transition-[padding]"
    >
        <!-- Добавить блок "Зависимости" в начале каждой страницы.
 Там выводятся автоматически полученные зависимости, а также блок "СТРОГИЕ ЗАВИСИМОСТИ", которые задаются вручную
 СТРОГИЕ ЗАВИСИМОСТИ -- это зависимости, которые необходимо знать, чтобы понять материал на этой странице!

-->

        <!-- ДОБАВИТЬ ПОЛУКРУГ или ЛИНЕЙНЫЙ ГРАДИЕНТ ИЗ БРЕНД ЦВЕТА В ПРОЗРАЧНЫЙ КАК НА NUXT ЗЕЛЕНОЕ ЗАРЕВО СВЕРХУ-->

        <div class="text-main">
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
