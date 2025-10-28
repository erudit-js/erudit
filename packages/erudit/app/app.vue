<script lang="ts" setup>
useThemeWatcher();
useAsideMajorPaneWatcher();
useAppElements();

prerenderRoutes('/api/prose/problemGenerator/aboba.js');
onMounted(async () => {
    const generatorModule = await import(
        /* @vite-ignore */ `http://localhost:3000/subfolder/api/prose/problemGenerator/aboba.js`
    );
    //console.log(generatorModule);
    console.log(
        await generatorModule.default.createProblemContent(9235, {
            language: 'ru',
        }),
    );
});
</script>

<template>
    <NuxtLoadingIndicator color="var(--color-brand)" />
    <div
        class="relative m-auto min-h-dvh max-w-(--w-max-content) overflow-clip
            border-x
            border-[light-dark(var(--color-neutral-300),var(--color-neutral-800))]
            shadow-[0_0_3px_0px_light-dark(rgba(0,0,0,0.05),rgba(0,0,0,0.18))]
            transition-[border]"
    >
        <SiteMain>
            <NuxtPage></NuxtPage>
        </SiteMain>
        <SiteAsideOverlay />
        <SiteAside :type="AsideType.Major" />
        <SiteAside :type="AsideType.Minor" />
    </div>
</template>
