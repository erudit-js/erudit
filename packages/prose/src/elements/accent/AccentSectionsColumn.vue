<script lang="ts" setup>
import { type AccentSectionSchema, type AccentSchema } from './schema';
import type { ParsedElement } from '../../element';
import type { ElementPhrases } from '../../app';

const { phrase } = defineProps<{
    phrase: ElementPhrases<any>;
    sections: ParsedElement<AccentSectionSchema<AccentSchema>>[];
}>();

console.log(phrase);
</script>

<template>
    <template v-for="section of sections">
        <div>{{ section.data.type }}</div>
    </template>
</template>
