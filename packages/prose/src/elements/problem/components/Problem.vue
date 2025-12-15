<script setup lang="ts">
import type { ProseElement } from '@jsprose/core';

import type { problemSchema } from '../problem.js';
import Block from '../../../app/shared/block/Block.vue';
import ProblemContainer from './ProblemContainer.vue';
import ProblemHeader from './ProblemHeader.vue';
import ProblemContent from './ProblemContent.vue';

defineProps<{
    element: ProseElement<typeof problemSchema>;
}>();
</script>

<template>
    <Block :element>
        <ProblemContainer>
            <ProblemHeader :info="element.data.info" />
            <ProblemContent
                :scriptUrl="element.data.script"
                :initialElements="element.children"
            />
        </ProblemContainer>
    </Block>
</template>
