<script lang="ts" setup>
import { type Cameo } from '@erudit-js/cog/schema';

import eruditConfig from '#erudit/config';

const props = defineProps<{ data: Cameo }>();
const emit = defineEmits<{
    (e: 'nextCameo'): void;
}>();

function getRandomAvatar(data: Cameo) {
    const avatars = data.avatars;

    if (!avatars || avatars.length === 0) {
        throw new Error(
            `No avatars available for the cameo with ID: ${data.cameoId}`,
        );
    }

    const url = avatars[Math.floor(Math.random() * avatars.length)]!;
    const ext = url.split('.').pop()?.toLowerCase();

    if (!ext) {
        throw new Error(
            `Failed to determine cameo avatar type for URL: ${url}`,
        );
    }

    const imageExts = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg'];
    const videoExts = ['mp4', 'webm', 'ogg', 'mov', 'avi', 'mkv'];
    let type: 'image' | 'video';

    if (imageExts.includes(ext)) type = 'image';
    else if (videoExts.includes(ext)) type = 'video';
    else
        throw new Error(
            `Unsupported cameo avatar type: ${ext} for URL: ${url}`,
        );

    return { url, type };
}

const { url: avatarSrc, type: avatarType } = getRandomAvatar(props.data);

const message =
    props.data.messages[
        Math.floor(Math.random() * props.data.messages.length)
    ]!;
</script>

<template>
    <div
        :class="$style.cameoData"
        :style="{ '--cameoColor': data.color ?? stringColor(data.cameoId) }"
    >
        <a :href="data.link" :class="$style.avatar" target="_blank">
            <img
                v-if="avatarType === 'image'"
                :src="avatarSrc"
                loading="lazy"
            />
            <video
                v-else-if="avatarType === 'video'"
                :src="avatarSrc"
                preload="metadata"
                autoplay
                loop
                muted
            ></video>
        </a>
        <div :class="$style.info">
            <div :class="$style.triangleBorder">
                <div :class="$style.triangle"></div>
            </div>
            <div :class="$style.message" v-html="message"></div>
            <footer>
                <span :class="$style.emoji">{{ data.emoji }}</span>
                <a :class="$style.name" :href="data.link" target="_blank">
                    {{ data.name }}
                </a>
                <MyIcon
                    v-if="data.link"
                    :class="$style.external"
                    name="link-external"
                />
                <span :style="{ flex: 1 }"></span>
                <span :class="$style.actions">
                    <EruditLink
                        v-if="eruditConfig.donate?.enabled"
                        to="/donate/"
                    >
                        <MyIcon name="cameo-add" />
                    </EruditLink>
                    <MyIcon
                        name="arrow-left"
                        @click="emit('nextCameo')"
                        :style="{ transform: 'scale(-1)' }"
                    />
                </span>
            </footer>
        </div>
    </div>
</template>

<style lang="scss" module>
@use '$/def/bp';

.cameoData {
    display: flex;
    align-items: start;
    gap: 40px;

    @include bp.below('mobile') {
        gap: 28px;
    }

    .avatar {
        width: 60px;
        aspect-ratio: 1;
        border-radius: 50%;
        overflow: hidden;
        border: 2px solid var(--bgMain);
        outline: 2px solid var(--cameoColor);
        box-shadow: 0 0 10px 1px
            color-mix(in srgb, var(--cameoColor), transparent 50%);

        > * {
            display: block;
        }

        @include bp.below('mobile') {
            width: 40px;
        }
    }

    .info {
        --cameoTriangleSize: 24px;
        --cameoBg: color-mix(
            in srgb,
            light-dark(#ffffff, #1c1c1e),
            var(--cameoColor) 15%
        );
        --cameoBorder: color-mix(in srgb, var(--border), var(--cameoColor) 30%);

        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 10px;
        position: relative;
        background: var(--cameoBg);
        border: 2px solid var(--cameoBorder);
        border-radius: 5px;
        border-top-left-radius: 0;
        padding: var(--gap);
        font-family: 'Noto Serif', serif;
        color: color-mix(in srgb, var(--text), var(--cameoColor) 10%);

        @include bp.below('mobile') {
            --cameoTriangleSize: 16px;
            padding: var(--gapSmall);
        }

        .message {
            font-size: 1.05em;

            strong {
                font-weight: 500;
                color: color-mix(
                    in srgb,
                    var(--textDeep),
                    var(--cameoColor) 20%
                );
            }
        }

        footer {
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 0.95em;
            flex-wrap: wrap;

            .name {
                font-family: 'Noto Sans', sans-serif;
                color: inherit;
                text-decoration-color: transparent;
                font-weight: 600;

                @include transition(text-decoration-color);

                &:hover {
                    text-decoration-color: inherit;
                }
            }

            .external {
                opacity: 0.35;
                font-size: 0.7em;
                margin-left: 3px;
            }

            .actions {
                display: flex;
                align-items: center;
                gap: 8px;
                font-size: 0.9em;

                > * {
                    color: color-mix(
                        in srgb,
                        var(--textDeep),
                        var(--cameoColor) 40%
                    );
                    cursor: pointer;
                    opacity: 0.3;
                    padding: 5px;
                    position: relative;
                    top: 6px;

                    @include transition(opacity);

                    &:hover {
                        opacity: 1;
                    }

                    @include bp.below('mobile') {
                        top: 0;
                    }
                }
            }
        }

        .triangle,
        .triangleBorder {
            position: absolute;
            border-style: solid;
        }

        .triangleBorder {
            top: -2px;
            left: calc(-1 * var(--cameoTriangleSize));
            border-width: 0 var(--cameoTriangleSize) var(--cameoTriangleSize) 0;
            border-color: transparent var(--cameoBorder) transparent transparent;
        }

        .triangle {
            --_smallerTriangleSize: calc(var(--cameoTriangleSize) - 4px);

            left: 5px;
            top: 2px;
            border-width: 0 var(--_smallerTriangleSize)
                var(--_smallerTriangleSize) 0;
            border-color: transparent var(--cameoBg) transparent transparent;
        }
    }
}
</style>
