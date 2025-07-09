<script lang="ts" setup>
import type { ContentReferenceGroup } from '@erudit-js/cog/schema';

import ReferenceSource from './ReferenceSource.vue';
import ReferenceItem from './ReferenceItem.vue';

defineProps<{ group: ContentReferenceGroup }>();
</script>

<template>
    <div :class="$style.group">
        <ReferenceSource :source="group.source">
            <template #after>
                <div :class="$style.references">
                    <ReferenceItem
                        v-for="reference of group.references"
                        :reference
                    />
                </div>
            </template>
        </ReferenceSource>
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
}
</style>
