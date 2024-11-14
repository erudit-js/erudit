<script lang="ts" setup>
import { type MyIconName } from '#my-icons';
import type { ContentReferenceSource } from '@package';

const props = defineProps<{ source: ContentReferenceSource }>();

const typeIcon = computed<MyIconName>(() => {
    switch (props.source.type) {
        case 'book':
            return 'book';
        case 'site':
            return 'globe';
        default:
            return 'file-lines';
    }
});

const phrase = await usePhrases('reference_source_featured');
</script>

<template>
    <div :class="$style.source">
        <div :class="$style.typeIcon">
            <MyIcon :name="typeIcon" />
        </div>
        <div :class="$style.body">
            <div :class="$style.header">
                <MyIcon :name="typeIcon" :class="$style.headerTypeIcon" />
                <a :href="source.link" target="_blank">{{ source.title }}</a>
                <MyIcon
                    v-if="source.featured"
                    name="star"
                    style="cursor: help"
                    :title="phrase.reference_source_featured"
                />
                <MyIcon
                    v-if="source.link"
                    name="link-external"
                    :class="$style.linkIcon"
                />
            </div>
            <div v-if="source.description" :class="$style.description">
                {{ source.description }}
            </div>
            <div v-if="source.comment" :class="$style.comment">
                {{ source.comment }}
            </div>
        </div>
    </div>
</template>

<style lang="scss" module>
@use '$/def/bp';

.source {
    display: flex;
    align-items: start;
    gap: var(--gap);

    .typeIcon {
        flex-shrink: 0;
        position: relative;
        top: 4px;
        color: var(--textMuted);

        @include bp.below(mobile) {
            display: none;
        }
    }

    .body {
        display: flex;
        flex-direction: column;
        gap: var(--gapSmall);

        .header {
            display: flex;
            align-items: center;
            gap: var(--gap);
            font-weight: 550;

            a[href] {
                @include hoverLink;
            }

            [my-icon] {
                flex-shrink: 0;
                font-size: 1em;
                color: var(--textDimmed);
            }

            .headerTypeIcon {
                color: var(--textMuted);
                display: none;
                @include bp.below(mobile) {
                    display: initial;
                }
            }

            .linkIcon {
                font-size: 0.85em;
                opacity: 0.6;
            }
        }

        .description,
        .comment {
            color: var(--textMuted);
        }

        .comment {
            font-style: italic;
        }
    }
}
</style>
