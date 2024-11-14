<script lang="ts" setup>
import type { ContentReferenceItem } from '@package';

defineProps<{ reference: ContentReferenceItem }>();
</script>

<template>
    <div :class="$style.reference">
        <MyIcon name="arrow-up-to-right" :class="$style.icon" />
        <div :class="$style.body">
            <div :class="$style.header">
                <a :href="reference.link" target="_blank">{{
                    reference.title
                }}</a>
                <MyIcon
                    v-if="reference.link"
                    name="link-external"
                    :class="$style.linkIcon"
                />
            </div>
            <div v-if="reference.description" :class="$style.description">
                {{ reference.description }}
            </div>
        </div>
    </div>
</template>

<style lang="scss" module>
.reference {
    font-size: 0.92em;
    display: flex;
    align-items: start;
    gap: var(--gap);

    .icon {
        position: relative;
        top: 4px;
        flex-shrink: 0;
        color: var(--textMuted);
    }

    .body {
        .header {
            display: flex;
            align-items: center;
            gap: var(--gap);
            font-weight: 550;

            a[href] {
                @include hoverLink;
            }

            .linkIcon {
                position: relative;
                left: -3px;
                flex-shrink: 0;
                color: var(--textDimmed);
                font-size: 0.85em;
                opacity: 0.6;
            }
        }

        .description {
            color: var(--textMuted);
        }
    }
}
</style>
