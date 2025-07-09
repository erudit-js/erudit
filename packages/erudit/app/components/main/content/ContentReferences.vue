<script lang="ts" setup>
import type { ContentReferences } from '@erudit-js/cog/schema';

import ReferenceGroup from './reference/ReferenceGroup.vue';

const props = defineProps<{ references: ContentReferences }>();

const count = computed(() => {
    return props.references.reduce(
        (sum, referenceGroup) => sum + (referenceGroup.references.length || 0),
        0,
    );
});

const phrase = await usePhrases('references', 'references_description');
</script>

<template>
    <MainSectionTitle icon="link-external" :title="phrase.references" :count />

    <p :class="$style.description">{{ phrase.references_description }}</p>

    <section :class="$style.referenceGroups">
        <ReferenceGroup v-for="group of references" :group />
    </section>
</template>

<style lang="scss" module>
.description {
    padding: var(--_pMainY) var(--_pMainX);
}

.referenceGroups {
    display: flex;
    flex-direction: column;
    padding: var(--_pMainY) var(--_pMainX);

    > *:not(:last-of-type) {
        padding-bottom: var(--gap);
        margin-bottom: var(--gap);
        border-bottom: 1px solid var(--border);
    }
}
</style>
