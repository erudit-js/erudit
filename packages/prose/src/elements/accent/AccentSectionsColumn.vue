<script lang="ts" setup>
import { type AccentSectionSchema, type AccentSchema } from './schema';
import type { ParsedElement } from '../../element';
import { type ElementPhrases } from '../../app';
import AccentColumnSection from './AccentColumnSection.vue';

defineProps<{
    phrase: ElementPhrases<any>;
    sections: ParsedElement<AccentSectionSchema<AccentSchema>>[];
}>();
</script>

<template>
    <div class="pt-normal">
        <AccentColumnSection v-for="section of sections" :phrase :section />
    </div>
</template>
