<script lang="ts" setup>
import type { TocItem } from '@erudit/shared/bitran/toc';

const props = defineProps<{ tocItem: TocItem; active: boolean }>();
const productName = props.tocItem.productName;
const productIcon = await useBitranElementIcon(productName);
const productPhrase = await useBitranElementLanguage(productName);

const pretty = useFormatText();

function tocItemClick(event: MouseEvent): void {
    navigateTo({
        query: {
            element: props.tocItem.id,
        },
        //hash: props.tocItem.id, // Apply page hash as requested in the comment
    });
    event.preventDefault();
    event.stopPropagation();
}
</script>

<template>
    <TreeItem
        :label="pretty(tocItem.title || productPhrase('_element_title'))"
        :level="tocItem.level"
        :link="`?element=${tocItem.id}`"
        :svg="productIcon"
        :active
        @click="tocItemClick"
    />
</template>
