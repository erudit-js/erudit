<script lang="ts" setup>
import type { TocItem } from '@erudit/shared/bitran/toc';

const { tocItem } = defineProps<{ tocItem: TocItem; active: boolean }>();

const productName = tocItem.productName;
const productIcon = await useBitranElementIcon(productName);
const productPhrase = await useBitranElementLanguage(productName);

function tocItemClick(event: Event) {
    navigateTo({
        query: {
            element: tocItem.id,
        },
    });
    event.preventDefault();
    event.stopPropagation();
    return false;
}
</script>

<template>
    <TreeItem
        :label="tocItem.title || productPhrase('_element_title')"
        :level="tocItem.level"
        :link="`?element=${tocItem.id}` /* Apply page hash! */"
        :svg="productIcon"
        :active
        @click="tocItemClick"
    />
</template>
