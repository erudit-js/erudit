<script lang="ts" setup>
import type { ContentSourceUsage } from '@shared/content/reference';

defineProps<{ usages: ContentSourceUsage[] }>();

const expanded = ref(false);
const pretty = useFormatText();
const phrase = await usePhrases('mentions');
</script>

<template>
    <div :class="[expanded && $style.expanded]">
        <div>
            <button :class="$style.toggleUsages" @click="expanded = !expanded">
                <span :class="$style.toggleUsageLabel">
                    {{
                        phrase.mentions(
                            usages.reduce((sum, usage) => sum + usage.count, 0),
                        )
                    }}
                </span>
                <MyIcon name="angle-right" :class="$style.toggleUsagesAngle" />
            </button>
        </div>
        <ul :class="$style.mentions">
            <li v-for="usageItem of usages" :class="$style.mention">
                <MyIcon name="arrow-up-to-right" />
                <EruditLink
                    :class="$style.mentionLabel"
                    :prefetch="false"
                    :to="usageItem.link"
                >
                    {{ pretty(usageItem.title) }}
                </EruditLink>
                <span :class="$style.mentionCount"
                    >({{ usageItem.count }})</span
                >
            </li>
        </ul>
    </div>
</template>

<style lang="scss" module>
.toggleUsages {
    display: flex;
    align-items: center;
    gap: 5px;
    cursor: pointer;

    &:hover {
        .toggleUsageLabel {
            text-decoration-color: var(--textDimmed);
        }
    }

    .toggleUsageLabel {
        color: var(--textMuted);
        font-weight: 500;
        text-decoration: underline;
        text-decoration-color: transparent;
        @include transition(text-decoration-color);
    }

    .toggleUsagesAngle {
        color: var(--textDimmed);
        @include transition(transform);

        .expanded & {
            transform: rotate(90deg);
        }
    }
}

.mentions {
    height: 0;
    overflow: hidden;
    @include transition(height);

    list-style: none;
    padding: 0;
    margin: 0;

    display: flex;
    flex-direction: column;
    gap: var(--gapSmall);
    color: var(--textMuted);
    font-size: 0.95em;

    .expanded & {
        height: auto;
    }

    .mention {
        display: flex;
        align-items: center;
        gap: var(--gapSmall);

        &:first-of-type {
            margin-top: var(--gapSmall);
        }

        .mentionLabel {
            color: var(--text);
            font-weight: 500;
            text-decoration-color: transparent;
            @include transition(text-decoration-color);

            &:hover {
                text-decoration-color: var(--textDimmed);
            }
        }

        .mentionCount {
            color: var(--textDimmed);
            font-weight: 500;
        }
    }
}
</style>
