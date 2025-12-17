<script setup lang="ts">
import type { ProseElement } from '@jsprose/core';

import type { problemCheckSchema } from '../../problemContent.js';
import ProblemExpander from '../ProblemExpander.vue';
import Check from './Check.vue';

defineProps<{ value: ProseElement<typeof problemCheckSchema>[] }>();
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
