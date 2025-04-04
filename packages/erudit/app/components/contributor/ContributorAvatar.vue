<script lang="ts" setup>
const props = defineProps<{ contributorId: string; avatar?: string }>();
const baseUrlPath = useBaseUrlPath();

const hasAvatar = computed(() => !!props.avatar);
</script>

<template>
    <div
        :class="$style.contributorAvatar"
        :style="{
            ...(!hasAvatar
                ? {
                      backgroundImage: `url(${eruditAsset('user.svg')})`,
                      backgroundColor: stringColor(props.contributorId),
                      backgroundBlendMode: 'hard-light',
                  }
                : {}),
        }"
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

    > img {
        display: block;
    }
}
</style>
