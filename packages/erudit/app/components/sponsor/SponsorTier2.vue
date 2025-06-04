<script lang="ts" setup>
import type { Tier2Sponsor } from '@erudit-js/cog/schema';

const props = defineProps<{
    sponsor: Tier2Sponsor;
}>();

const sponsorColor = computed(() => {
    return props.sponsor.color ?? stringColor(props.sponsor.sponsorId);
});
</script>

<template>
    <a
        :href="props.sponsor.link"
        target="_blank"
        rel="noopener noreferrer"
        :class="$style.sponsorItem"
        :style="{ '--sponsorColor': sponsorColor }"
    >
        <div :class="$style.avatarWrapper">
            <Avatar
                icon="diamond"
                :src="sponsor.avatar"
                :color="sponsorColor"
                :class="$style.avatar"
                :styling="{ glow: true, border: true }"
            />
            <MyRuntimeIcon
                v-if="sponsor.icon"
                name="sponsor-icon"
                :svg="sponsor.icon"
                :class="$style.icon"
            />
        </div>
        <div :class="$style.info">
            <div :class="$style.name">{{ sponsor.name }}</div>
            <div v-if="sponsor.slogan" :class="$style.slogan">
                {{ sponsor.slogan }}
            </div>
        </div>
    </a>
</template>

<style lang="scss" module>
@use '$/def/bp';

.sponsorItem {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 22px;
    padding: var(--gap);
    border-radius: 5px;
    background: transparent;
    text-decoration: none;
    text-align: center;

    @include transition(background);

    @include bp.below('mobile') {
        border-radius: 0;
    }

    &:hover {
        background: color-mix(in srgb, var(--bgMain), var(--sponsorColor) 10%);
    }

    .avatarWrapper {
        position: relative;

        .avatar {
            --avatarSize: 100px;
        }

        .icon {
            --iconSize: 26px;

            position: absolute;
            bottom: calc(-1 * var(--iconSize) / 2);
            left: 50%;
            transform: translateX(-50%);

            display: flex;
            align-items: center;
            justify-content: center;

            color: var(--sponsorColor);
            font-size: calc(var(--iconSize) / 1.8);
            width: var(--iconSize);
            height: var(--iconSize);
            border-radius: 50%;
            border: 1.5px solid var(--sponsorColor);
            background: var(--bgMain);
        }
    }

    .info {
        .name {
            font-weight: 600;
            color: color-mix(in srgb, var(--text), var(--sponsorColor) 50%);
        }

        .slogan {
            color: var(--textMuted);
        }
    }
}
</style>
