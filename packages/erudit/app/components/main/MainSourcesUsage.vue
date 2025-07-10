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

const showTooManyOverlay = ref(count.value > 5);

const phrase = await usePhrases(
    'references',
    'references_description',
    'show_all',
);
</script>

<template>
    <MainSection v-if="usageSet && count">
        <MainSectionTitle
            icon="link-external"
            :title="phrase.references"
            :count
        />

        <p :class="$style.description">{{ phrase.references_description }}</p>

        <ul :class="[$style.sources, showTooManyOverlay && $style.tooMany]">
            <li v-for="usageItem of usageSet">
                <ReferenceSource :source="usageItem.source">
                    <template #after>
                        <MainSourceUsages :usages="usageItem.usages" />
                    </template>
                </ReferenceSource>
            </li>
            <div v-if="showTooManyOverlay" :class="$style.overlay">
                <button @click="showTooManyOverlay = false">
                    <MyIcon name="eye" />{{ phrase.show_all }}
                </button>
            </div>
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

    &.tooMany {
        position: relative;
        overflow: hidden;
        max-height: 500px;

        .overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(
                to bottom,
                transparent,
                var(--bgMain) 95%
            );
            pointer-events: none;

            button {
                position: absolute;
                bottom: var(--gap);
                left: 50%;
                transform: translateX(-50%);

                display: flex;
                align-items: center;
                gap: var(--gap);
                font-weight: 500;
                color: var(--textMuted);
                padding: 10px 20px;
                border-radius: 5px;
                border: 1px solid var(--border);
                background: var(--bgAside);
                cursor: pointer;
                pointer-events: all;
                box-shadow: 0 0 12px 1px rgba(0, 0, 0, 0.2);

                @include transition(color);

                &:hover {
                    color: var(--text);
                    [my-icon] {
                        color: var(--text);
                    }
                }

                [my-icon] {
                    font-size: 1.1em;
                    color: var(--textDimmed);

                    @include transition(color);
                }
            }
        }
    }
}
</style>
