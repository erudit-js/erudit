<script lang="ts" setup>
import type { ContentReferenceGroup } from '@package';

import ReferenceSource from './ReferenceSource.vue';
import ReferenceItem from './ReferenceItem.vue';

defineProps<{ group: ContentReferenceGroup }>();
</script>

<template>
    <div :class="$style.group">
        <ReferenceSource :source="group.source" />
        <div :class="$style.references">
            <ReferenceItem v-for="reference of group.references" :reference />
        </div>
    </div>
</template>

<style lang="scss" module>
@use '$/def/bp';

.group {
    display: flex;
    flex-direction: column;
    gap: var(--gap);
}

.references {
    display: flex;
    flex-direction: column;
    gap: var(--gap);
    margin-left: 34px;

    @include bp.below(mobile) {
        margin-left: 0;
    }
}
</style>
