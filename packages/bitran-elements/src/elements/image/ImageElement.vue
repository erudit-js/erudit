<script lang="ts" setup>
import {
    type ElementProps,
    useElementParseData,
    useElementRenderData,
} from '@bitran-js/renderer-vue';

import Image from './Image.vue';
import type { ImageSchema } from './shared';

defineProps<ElementProps<ImageSchema>>();

const parseData = useElementParseData<ImageSchema>();
const renderData = useElementRenderData<ImageSchema>();
</script>

<template>
    <Image :parseData :renderData />
</template>
