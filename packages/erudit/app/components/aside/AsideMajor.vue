<template>
    <div class="flex h-full flex-col">
        <AsideMajorSiteInfo />
        <AsideMajorPaneSwitcher />
        <AsideMajorPaneHolder />
        <AdsBannerAside v-if="adsAsideAllowed()" />
    </div>
</template>
