<script lang="ts" setup>
import { topicParts, type TopicPart } from '@erudit-js/cog/schema';

import type { TopicPartLinks } from '@erudit/shared/content/data/type/topic';
import { TOPIC_PART_ICON } from '@erudit/shared/icons';

defineProps<{ partLinks: TopicPartLinks; active: TopicPart }>();

const phrase = await usePhrases('article', 'summary', 'practice');
const Link = defineNuxtLink({ prefetch: false });
</script>

<template>
    <section :class="$style.topicPartSwitch">
        <Link
            v-for="topicPart of topicParts"
            :to="partLinks[topicPart]"
            :class="[
                $style.partButton,
                active === topicPart && $style.active,
                !partLinks[topicPart] && $style.noLink,
            ]"
        >
            <MyIcon :name="TOPIC_PART_ICON[topicPart]" />
            <div :class="$style.label">{{ phrase[topicPart] }}</div>
        </Link>
    </section>
</template>

<style lang="scss" module>
@use '$/def/bp';

.topicPartSwitch {
    --height: 50px;

    position: relative;
    top: 65px;

    display: flex;
    align-items: end;
    justify-content: center;
    gap: var(--gapBig);
    margin: var(--_pMainY) 0;
    margin-top: -30px;

    width: 100%;
    height: var(--height);
    border-bottom: 2px solid transparent;
}

.partButton {
    position: relative;
    top: 2px;

    display: flex;
    align-items: center;
    gap: calc(var(--gap) / 1.3);
    padding: 0 var(--gap);

    height: var(--height);
    background: var(--bgMain);
    border: 2px solid var(--border);
    border-bottom-color: transparent;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;

    line-height: 0;
    text-decoration: none;
    font-weight: 550;
    color: var(--textMuted);

    @include transition(color, background, border-color);

    [my-icon] {
        font-size: 1.1em;
    }

    &:not(.active) {
        background: var(--bgAside);
        border-bottom-color: color-mix(
            in srgb,
            var(--border),
            var(--bgMain) 50%
        );

        &.noLink {
            color: color-mix(in srgb, var(--textDisabled), transparent 35%);
            border-bottom-color: var(--border);
            cursor: not-allowed;
        }

        &:not(.noLink):hover {
            color: var(--text);
            background: var(--bgMain);
            border-bottom-color: transparent;
        }
    }

    &.active {
        color: var(--brand);
    }
}

@include bp.below('mobile') {
    .topicPartSwitch {
        --height: 45px;
        gap: var(--gap);
    }

    .partButton {
        gap: var(--gapSmall);

        &:not(.active) {
            .label {
                display: none;
            }
        }
    }
}
</style>
