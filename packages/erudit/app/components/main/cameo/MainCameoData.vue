<script lang="ts" setup>
import { type Cameo } from '@erudit-js/cog/schema';

import eruditConfig from '#erudit/config';
import { detectStrictFileType } from '@erudit/utils/ext';

const props = defineProps<{
    data: Cameo;
    hasMultipleCameos: boolean;
}>();
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
    let type = detectStrictFileType(url, 'image', 'video');

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
            <Avatar
                :src="avatarSrc"
                :color="data.color ?? stringColor(data.cameoId)"
                :styling="{ glow: true, border: true }"
            />
        </a>
        <div :class="$style.info">
            <div :class="$style.triangleBorder">
                <div :class="$style.triangle"></div>
            </div>
            <div :class="$style.message" v-html="message"></div>
            <footer>
                <MyRuntimeIcon
                    v-if="data.icon"
                    name="cameo-icon"
                    :svg="data.icon"
                    :class="$style.icon"
                />
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
                    <EruditLink v-if="eruditConfig.sponsors" to="/sponsors/">
                        <MyIcon name="cameo-add" />
                    </EruditLink>
                    <MyIcon
                        v-if="hasMultipleCameos"
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

    .avatar > * {
        --avatarSize: 60px;

        @include bp.below('mobile') {
            --avatarSize: 40px;
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

            .icon {
                color: color-mix(in srgb, var(--text), var(--cameoColor) 80%);
            }

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
