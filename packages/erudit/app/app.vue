<script lang="ts" setup>
// Watching and setting theme
initThemeWatcher();

// Fetching and setting global navigation variable
await initGlobalContentNav();

await initFormatText();
await initAppElements();

// Watching route changes and set corresponsing aside major pane
initAsideMajorPaneWatcher();
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
