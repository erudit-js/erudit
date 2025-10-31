<script lang="ts" setup>
import type { ParsedElement } from '../../../../element';
import type { ProblemHintSchema } from '../../content';
import { useProblemPhrase } from '../../composables/phrase';
import ProblemExpander from '../ProblemExpander.vue';
import Render from '../../../../app/front/components/Render.vue';
import ProblemExpanderSection from '../ProblemExpanderSection.vue';

defineProps<{ value: ParsedElement<ProblemHintSchema>[] }>();

const phrase = await useProblemPhrase();
</script>

<template>
    <ProblemExpander>
        <div v-if="value.length === 1" class="py-(--proseAsideWidth)">
            <Render v-for="child of value[0]!.children" :element="child" />
        </div>
        <ProblemExpanderSection
            v-else
            v-for="(hint, i) of value"
            :title="phrase.action_hint + ' ' + (i + 1)"
            :element="hint"
        />
    </ProblemExpander>
</template>
