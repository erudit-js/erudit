<script lang="ts" setup>
import type { ContentReferences } from '@package';

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
    <h2 :class="$style.heading">
        <MyIcon name="link-external" :class="$style.icon" />
        <span :class="$style.title">{{ phrase.references }}</span>
        <span :class="$style.count">{{ count }}</span>
    </h2>

    <p :class="$style.description">{{ phrase.references_description }}</p>

    <section :class="$style.referenceGroups">
        <ReferenceGroup v-for="group of references" :group />
    </section>
</template>

<style lang="scss" module>
.heading {
    display: flex;
    align-items: center;
    gap: var(--gap);
    padding: var(--_pMainY) var(--_pMainX);

    .icon {
        font-size: 0.9em;
        color: var(--textMuted);
    }

    .count {
        position: relative;
        top: 1px;
        font-weight: 550;
        font-size: 0.6em;
        background: color-mix(in srgb, var(--textDimmed), transparent 65%);
        border-radius: 20px;
        padding: 2px 10px;
    }
}

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
