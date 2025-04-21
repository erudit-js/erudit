<script lang="ts" setup>
import {
    useElementNode,
    useElementParseData,
    useElementRenderData,
    type ElementProps,
} from '@bitran-js/renderer-vue';

import { type ProblemSchema } from '../shared';
import ProblemContainer from './ProblemContainer.vue';
import ProblemContentElement from './ProblemContent.vue';

defineProps<ElementProps<ProblemSchema>>();
const node = useElementNode<ProblemSchema>();
const parseData = useElementParseData<ProblemSchema>();
const renderData = useElementRenderData<ProblemSchema>();
</script>

<template>
    <ProblemContainer :node :info="parseData.info">
        <ProblemContentElement
            :node
            :content="parseData"
            :generatorContentPath="renderData?.generatorContentPath"
        />
    </ProblemContainer>
</template>
