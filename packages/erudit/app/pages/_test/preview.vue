<script lang="ts" setup>
import { PreviewDataType } from '@app/scripts/preview/data';
import { createPreviewError } from '@app/scripts/preview/data/alert';
import { PreviewRequestType } from '@app/scripts/preview/request';
import {
    PreviewThemeName,
    showPreview,
    togglePreview,
} from '@app/scripts/preview/state';

function showCustom() {
    showPreview({
        type: PreviewRequestType.Data,
        data: {
            type: PreviewDataType.Custom,
            message: 'This is custom message for preview!',
            footer: {
                //iconName: 'arrow-left',
                iconSvg:
                    '<svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M6.42436 0H9.57565L14.995 16H11.8276L10.8115 13H5.18855L4.17242 16H1.005L6.42436 0ZM6.20468 10H9.79533L8 4.69952L6.20468 10Z"></path> </g></svg>',
                secondary: 'Secondary raw text',
                primary: 'Primary raw text',
                href: 'https://google.com',
            },
        },
    });
}

function showAlert(theme: PreviewThemeName) {
    showPreview({
        type: PreviewRequestType.Data,
        data: createPreviewError({
            theme,
            message: 'This is message!',
            title: 'Custom Title',
            pre: JSON.stringify(
                {
                    foo: 1337,
                    bar: 'Some text',
                },
                null,
                4,
            ),
        }),
    });
}
</script>

<template>
    <button @click="() => togglePreview()">Toggle Preview</button>
    <div>
        Show:
        <br />
        <button :class="$style.button" @click="showCustom">Custom</button>
        <br />
        <button
            :class="$style.button"
            v-for="theme in PreviewThemeName"
            @click="() => showAlert(theme)"
        >
            Alert {{ theme }}
        </button>
        <br />
        <button
            :class="$style.button"
            @click="
                showPreview({
                    type: PreviewRequestType.MissingElement,
                    elementId: 'foo-id',
                })
            "
        >
            Missing element
        </button>
        <button
            :class="$style.button"
            @click="
                showPreview({
                    type: PreviewRequestType.MissingElement,
                    elementId: 'foo-id',
                    hashMismatch: { current: 'bar', expected: 'baz' },
                })
            "
        >
            Missing element + hash mismatch
        </button>
        <br />
        <button
            :class="$style.button"
            @click="
                showPreview({
                    type: PreviewRequestType.HashMismatch,
                    currentHash: 'foo',
                    expectedHash: 'bar',
                })
            "
        >
            Hash mismatch
        </button>
    </div>
</template>

<style lang="scss" module>
.button {
    border: 2px solid var(--border);
    border-radius: 3px;
    padding: 3px;
    margin: 3px;
}
</style>
