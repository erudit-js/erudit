<script lang="ts" setup>
import type { MyIconName } from '#my-icons';
import { detectStrictFileType } from '@erudit/utils/ext';

const props = defineProps<{
    src?: string;
    icon?: MyIconName;
    color?: string;
    styling?: Partial<{
        glow: boolean;
        border: boolean;
    }>;
}>();

const assetRoute = useAssetRoute();

const avatarSrc = computed(() => {
    return props.src ? assetRoute(props.src) : undefined;
});

const fallbackVisible = computed(() => {
    return !avatarSrc.value /* || failed to load src */;
});

const avatarType = computed(() => {
    return avatarSrc.value
        ? detectStrictFileType(avatarSrc.value, 'image', 'video')
        : undefined;
});
</script>

<template>
    <div
        :class="[
            $style.avatar,
            styling?.glow && $style.glow,
            styling?.border && $style.border,
        ]"
        :style="{ ['--avatarColor']: props.color }"
    >
        <div :class="$style.inner">
            <div v-if="fallbackVisible" :class="$style.fallback">
                <MyIcon :name="icon || '__missing'" />
            </div>
            <template v-else>
                <img
                    v-if="avatarType === 'image'"
                    :src="avatarSrc"
                    loading="lazy"
                />
                <video
                    v-else
                    :src="avatarSrc"
                    preload="metadata"
                    autoplay
                    loop
                    muted
                ></video>
            </template>
        </div>
    </div>
</template>

<style lang="scss" module>
.avatar {
    --avatarSize: 110px;
    --avatarColor: var(--border);

    width: var(--avatarSize);
    height: var(--avatarSize);
    border-radius: 50%;

    .inner {
        width: 100%;
        height: 100%;
        overflow: hidden;
        border-radius: 50%;

        img,
        video {
            width: 100%;
            height: 100%;
            object-fit: cover;
            object-position: center;
        }
    }

    .fallback {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        background: linear-gradient(
            45deg,
            color-mix(in srgb, var(--avatarColor), black 10%),
            color-mix(in srgb, var(--avatarColor), white 40%)
        );
        color: color-mix(in srgb, black, var(--avatarColor) 50%);
        font-size: calc(var(--avatarSize) / 1.85);
    }

    //
    //
    //

    &.glow {
        box-shadow: 0 0 7px 7px
            color-mix(in srgb, var(--avatarColor), transparent 85%);
    }

    &.border {
        border: 2px solid var(--avatarColor);
        padding: 2px;
    }
}
</style>
