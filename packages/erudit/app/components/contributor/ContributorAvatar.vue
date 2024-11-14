<script lang="ts" setup>
const props = defineProps<{ contributorId: string; avatar?: string }>();
const baseUrlPath = useBaseUrlPath();

const hasAvatar = computed(() => !!props.avatar);
</script>

<template>
    <div
        :class="[$style.contributorAvatar, !hasAvatar && $style.noAvatar]"
        :style="{ '--_avatarBlendColor': stringColor(props.contributorId) }"
    >
        <img
            v-if="hasAvatar"
            :src="baseUrlPath(contributorAsset(avatar!))"
            loading="lazy"
        />
    </div>
</template>

<style lang="scss" module>
.contributorAvatar {
    $avatarSize: 40px;
    --_avatarBlendColor: var(--brand);

    position: relative;
    width: #{$avatarSize};
    height: #{$avatarSize};
    border-radius: 50%;
    overflow: hidden;
    background: var(--border);

    &.noAvatar {
        background-image: url('/_erudit-asset/user.svg');
        background-color: var(--_avatarBlendColor);
        background-blend-mode: hard-light;
    }

    > img {
        display: block;
    }
}
</style>
