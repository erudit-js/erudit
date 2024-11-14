<script lang="ts" setup>
import eruditConfig from '#erudit/config';

import PaneSwitch from './major/PaneSwitch.vue';

const { panes, activePane, getPaneOrder } = useMajorPane();

function paneStyle(paneKey: MajorPaneKey) {
    const thisPaneOrder = getPaneOrder(paneKey);
    const activePaneOrder = getPaneOrder(activePane.value);

    return {
        left: `calc(${Math.sign(thisPaneOrder - activePaneOrder)} * var(--wAside))`,
        opacity: thisPaneOrder === activePaneOrder ? 1 : 0,
    };
}
</script>

<template>
    <div :class="$style.asideInner">
        <AsideMajorSiteInfo />
        <PaneSwitch />
        <div :class="$style.paneHolder">
            <component
                v-for="(pane, paneKey) of panes"
                :is="pane.content"
                :class="$style.pane"
                :style="paneStyle(paneKey)"
            />
        </div>
        <AdsLeftBanner v-if="eruditConfig.ads?.leftBlockId" />
    </div>
</template>

<style lang="scss" module>
.asideInner {
    display: flex;
    flex-direction: column;
    height: 100%;
}

.paneHolder {
    flex: 1;
    position: relative;
    overflow-x: hidden;
}

.pane {
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    @include transition(left, opacity);
}
</style>
