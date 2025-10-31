<script setup lang="ts">
import type { ParsedElement } from '../../../../element';
import { type ProblemCheckSchema } from '../../content';
import ProblemExpander from '../ProblemExpander.vue';
import Check from './Check.vue';

defineProps<{ value: ParsedElement<ProblemCheckSchema>[] }>();
</script>

<template>
    <ProblemExpander>
        <div
            class="micro:grid-cols-2 grid gap-(--proseAsideWidth)
                p-(--proseAsideWidth)"
        >
            <Check v-for="check of value" :check />
        </div>
    </ProblemExpander>
</template>
