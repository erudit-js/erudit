<script lang="ts" setup>
import { Render } from '@bitran-js/renderer-vue';

import type { Caption } from './caption';

import captionClasses from './caption.module.scss';

defineProps<{ caption?: Caption }>();
</script>

<template>
    <figure>
        <slot></slot>
        <figcaption
            v-if="caption"
            :class="[captionClasses.caption, captionClasses.figure]"
            :style="{ maxWidth: caption.maxWidth ?? '100%' }"
        >
            <div :class="$style.main">
                <Render :node="caption.main" />
            </div>
            <div v-if="caption.secondary">
                <Render :node="caption.secondary" />
            </div>
        </figcaption>
    </figure>
</template>

<style lang="scss" module>
@use './caption.module';
</style>
