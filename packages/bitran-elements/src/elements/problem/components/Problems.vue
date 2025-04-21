<script lang="ts" setup>
import { ref } from 'vue';
import {
    useElementNode,
    useElementParseData,
    Render,
    type ElementProps,
    useElementRenderData,
} from '@bitran-js/renderer-vue';

import ProblemContainer from './ProblemContainer.vue';
import ProblemContentComponent from './ProblemContent.vue';
import PaneView from '../../../shared/PaneView.vue';
import { type ProblemsSchema } from '../shared';

defineProps<ElementProps<ProblemsSchema>>();
const node = useElementNode<ProblemsSchema>();
const parseData = useElementParseData<ProblemsSchema>();
const renderData = useElementRenderData<ProblemsSchema>();

const activeProblemIndex = ref(0);

const isProblemActive = (index: number) => {
    return activeProblemIndex.value === index;
};
</script>

<template>
    <ProblemContainer :node :info="parseData.info">
        <div v-if="parseData.shared" :class="$style.shared">
            <Render :node="parseData.shared" />
        </div>

        <div :class="$style.selector">
            <button
                v-for="(problem, i) of parseData.set"
                :key="i"
                :class="[$style.option, isProblemActive(i) && $style.active]"
                @click="activeProblemIndex = i"
            >
                {{ i + 1 }}
            </button>
        </div>

        <PaneView :paneKey="activeProblemIndex">
            <div :class="$style.selectedProblem">
                <ProblemContentComponent
                    :node
                    :content="parseData.set[activeProblemIndex]!"
                    :generatorContentPath="
                        renderData?.generatorContentPaths[activeProblemIndex]
                    "
                />
            </div>
        </PaneView>
    </ProblemContainer>
</template>

<style lang="scss" module>
@use '@bitran-js/renderer-vue/scss/utils' as bitranUtils;
@use '@bitran-js/renderer-vue/scss/bp' as bitranBp;

.shared {
    padding-right: var(--_bitran_asideWidth);
}

.selector {
    display: flex;
    flex-wrap: wrap;
    gap: var(--bitran_gap);
    padding: 0 var(--_bitran_asideWidth);

    @include bitranBp.below('mobile') {
        gap: var(--bitran_gapSmall);
    }

    .option {
        padding: 3px 8px;
        min-width: 50px;
        font-size: 0.8em;
        background: var(--bgMain);
        border-radius: 5px;
        text-align: center;
        font-weight: 600;
        color: var(--bitran_textMuted);
        border: 1px solid
            color-mix(in srgb, var(--bitran_colorBorder), var(--bgAside) 50%);
        box-shadow: 0 1px 3px light-dark(rgba(black, 0.08), rgba(white, 0.05));
        cursor: pointer;

        @include bitranUtils.transition(background, color, border-color);

        &:hover,
        &.active {
            color: var(--bitran_colorBrand);
            border-color: color-mix(
                in srgb,
                var(--bitran_colorBrand),
                var(--bitran_colorBorder) 80%
            );
        }

        &.active {
            background: color-mix(
                in srgb,
                var(--bitran_colorBrand),
                var(--bgMain) 90%
            );
        }
    }
}

.selectedProblem {
    border-top: 1px solid var(--bitran_colorBorder);
    padding-top: var(--bitran_gap);
}
</style>
