<script lang="ts" setup>
import type { ProseElement } from '@jsprose/core';

import type { ProblemContentChild } from '../problemContent.js';

defineProps<{
    scriptUrl?: string;
    initialElements: ProseElement<ProblemContentChild>[];
}>();
</script>

<template>
    <div>Problem Content</div>
</template>
