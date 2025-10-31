<script lang="ts" setup>
import { isElement, type ParsedElement } from '../../../../element';
import type { ElementSchemaAny } from '../../../../schema';
import { ProblemSection, type ProblemSectionSchema } from '../../content';
import Render from '../../../../app/front/components/Render.vue';
import ProblemExpander from '../ProblemExpander.vue';
import ProblemExpanderSection from '../ProblemExpanderSection.vue';

const { value } = defineProps<{ value: ParsedElement<ElementSchemaAny> }>();

const defaultBlocks = value.children!.filter(
    (element) => !isElement(element, ProblemSection),
);

const sections = value.children!.filter((element) =>
    isElement(element, ProblemSection),
) as ParsedElement<ProblemSectionSchema>[];
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
