<script lang="ts" setup>
import PaneSwitchButton from './PaneSwitchButton.vue';

const { panes, activePane, getPaneOrder } = useMajorPane();

const phrase = await usePhrases(
    ...Object.values(panes).map((pane) => pane.phrase),
);
</script>

<template>
    <section :class="$style.paneSwitch">
        <div :class="$style.inner">
            <PaneSwitchButton
                v-for="(pane, paneKey) of panes"
                :paneKey
                :icon="pane.icon"
                :title="phrase[pane.phrase]"
            />

            <div
                :class="$style.slider"
                :style="{ '--_activePane': getPaneOrder(activePane) }"
            ></div>
        </div>
    </section>
</template>

<style lang="scss" module>
.paneSwitch {
    --buttonSize: 40px;
    --gapSize: var(--gap);

    border-bottom: 1px solid var(--border);
    display: flex;
    justify-content: center;

    .inner {
        position: relative;
        display: flex;
    }

    .slider {
        position: absolute;
        width: var(--buttonSize);
        height: 3px;
        bottom: -1px;
        margin-left: calc(var(--gapSize) / 2);
        background: var(--textMuted);
        left: calc(var(--_activePane) * (var(--buttonSize) + var(--gapSize)));
        @include transition(left);
    }
}
</style>
