<script lang="ts" setup>
import type { Tier1Sponsor } from '@erudit-js/cog/schema';

const props = defineProps<{
    sponsor: Tier1Sponsor;
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
        <Avatar
            icon="diamond"
            :src="sponsor.avatar"
            :color="sponsorColor"
            :class="$style.avatar"
            :styling="{ glow: true }"
        />
        <div>
            <div :class="$style.main">
                <MyRuntimeIcon
                    v-if="sponsor.icon"
                    name="sponsor-icon"
                    :svg="sponsor.icon"
                    :class="$style.icon"
                />
                <span :class="$style.name">{{ sponsor.name }}</span>
            </div>
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
    gap: var(--gap);
    align-items: center;
    padding: var(--gap);
    font-size: 0.9em;
    border-radius: 5px;
    background: transparent;
    text-decoration: none;

    @include transition(background);

    @include bp.below('mobile') {
        border-radius: 0;
    }

    &:hover {
        background: color-mix(in srgb, var(--bgMain), var(--sponsorColor) 12%);
    }

    .avatar {
        --avatarSize: 50px;
        flex-shrink: 0;
    }

    .main {
        display: flex;
        align-items: center;
        gap: 8px;
        font-weight: 600;
        color: color-mix(in srgb, var(--text), var(--sponsorColor) 50%);

        .icon {
            opacity: 0.6;
        }
    }

    .slogan {
        color: var(--textMuted);
    }
}
</style>
