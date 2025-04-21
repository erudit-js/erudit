<script lang="ts" setup>
import { ref, watch } from 'vue';
import type { ElementNode } from '@bitran-js/core';
import { injectBitranProps, Render } from '@bitran-js/renderer-vue';

import type { ProblemContentItem } from '../shared';
import type { ProblemGeneratorReturn } from '../generator';

const props = defineProps<{
    node: ElementNode;
    contentItem: ProblemContentItem;
    generatedResult?: ProblemGeneratorReturn;
}>();

const bitranProps = injectBitranProps();

const generationId = ref(0);
const generating = ref(false);
const pendingGeneration = ref(false);

watch(
    () => props.generatedResult,
    (generatedResult) => regenerateContentItem(generatedResult),
);

await regenerateContentItem(props.generatedResult);

async function regenerateContentItem(generatedState?: ProblemGeneratorReturn) {
    if (!generatedState) {
        return;
    }

    if (generating.value) {
        // If already generating, set pending flag to restart after current generation
        pendingGeneration.value = true;
        return;
    }

    generating.value = true;

    try {
        //
        // Generation Process
        //

        const resolvedBiCode = props.contentItem.source.replace(
            /\{\{\s*([^}]+)\s*\}\}/g,
            (match, key) => {
                const trimmedKey = key.trim();
                const value = generatedState[trimmedKey];
                return value === undefined ? match : String(value);
            },
        );

        const blocks =
            await bitranProps.transpiler.parser.parseBlocks(resolvedBiCode);

        // //

        if (pendingGeneration.value) {
            pendingGeneration.value = false;
            generating.value = false; // Reset flag before recursive call
            regenerateContentItem(generatedState);
        } else {
            //
            // Applying Results
            //

            props.contentItem.blocks.setNodes(blocks);
            generationId.value++;

            // //
            generating.value = false; // Reset only after applying results
        }
    } catch (error) {
        generating.value = false;
        throw error;
    }
}
</script>

<template>
    <div :class="$style.problemContentItem">
        <Suspense suspensible>
            <Render :key="generationId" :node="contentItem.blocks" />
        </Suspense>
    </div>
</template>

<style lang="scss" module>
@use '@bitran-js/renderer-vue/scss/utils' as bitranUtils;

.problemContentItem {
    padding: var(--problemGap) var(--_bitran_asideWidth);
    padding-left: 0;
    height: auto;

    @include bitranUtils.transition(height, filter);
}
</style>
