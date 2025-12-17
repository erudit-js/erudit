<script lang="ts" setup>
import { watchEffect } from 'vue';
import {
    isProseElement,
    type AnySchema,
    type ProseElement,
} from '@jsprose/core';

import { problemSectionSchema } from '../../problemContent.js';
import { useArrayContainsAnchor } from '../../../../app/composables/anchor.js';
import ProblemExpander from '../ProblemExpander.vue';
import ProblemExpanderSection from '../ProblemExpanderSection.vue';
import Render from '../../../../app/shared/Render.vue';

const { value } = defineProps<{ value: ProseElement<AnySchema> }>();

const defaultBlocks = value.children!.filter(
    (element) => !isProseElement(element, problemSectionSchema),
);

const sections = value.children!.filter((element) =>
    isProseElement(element, problemSectionSchema),
) as ProseElement<typeof problemSectionSchema>[];
</script>

<template>
    <ProblemExpander>
        <div v-if="defaultBlocks.length" class="py-(--proseAsideWidth)">
            <Render v-for="child of defaultBlocks" :element="child" />
        </div>
        <ProblemExpanderSection
            v-if="sections.length"
            v-for="section of sections"
            :title="section.data"
            :element="section"
        />
    </ProblemExpander>
</template>
