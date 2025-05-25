<script lang="ts" setup>
import type { TocItem } from '@erudit/shared/bitran/toc';

const props = defineProps<{ tocItem: TocItem; active: boolean }>();
const productName = props.tocItem.productName;
const productIcon = await useBitranElementIcon(productName);
const productPhrase = await useBitranElementLanguage(productName);
const pretty = useFormatText();
</script>

<template>
    <TreeItem
        :label="pretty(tocItem.title || productPhrase('_element_title'))"
        :level="tocItem.level"
        :link="`#${tocItem.id}`"
        :svg="productIcon"
        :active
    />
</template>
