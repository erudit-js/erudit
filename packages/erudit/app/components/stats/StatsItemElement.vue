<script lang="ts" setup>
import type { ElementStat } from '@shared/stat';

const props = defineProps<{ stat: ElementStat }>();

const icon = await useBitranElementIcon(props.stat.elementName);
const language = await useBitranElementLanguage(props.stat.elementName);
const label = language('_element_title');
</script>

<template>
    <StatsItem :stat="{ type: 'custom', icon, label, count: stat.count }" />
</template>
