<script lang="ts" setup>
import type { ContentSourceUsageSet } from '@shared/content/reference';
import ReferenceSource from '@app/components/main/content/reference/ReferenceSource.vue';

const props = defineProps<{
    usageSet?: ContentSourceUsageSet;
}>();

const count = computed(() => {
    if (!props.usageSet) {
        return 0;
    }

    return Object.keys(props.usageSet).length;
});

const phrase = await usePhrases('references', 'references_description');
</script>

<template>
    <MainSection v-if="usageSet && count">
        <MainSectionTitle
            icon="link-external"
            :title="phrase.references"
            :count
        />

        <p :class="$style.description">{{ phrase.references_description }}</p>

        <ul :class="$style.sources">
            <li v-for="usageItem of usageSet">
                <ReferenceSource :source="usageItem.source">
                    <template #after>
                        <MainSourceUsages :usages="usageItem.usages" />
                    </template>
                </ReferenceSource>
            </li>
        </ul>
    </MainSection>
</template>

<style lang="scss" module>
.description {
    padding: var(--_pMainY) var(--_pMainX);
}

.sources {
    display: flex;
    flex-direction: column;
    gap: var(--gap);
    list-style: none;
    padding: var(--_pMainY) var(--_pMainX);
    margin: 0;

    > li:not(:last-of-type) {
        border-bottom: 1px solid var(--border);
        padding-bottom: var(--gap);
    }
}
</style>
