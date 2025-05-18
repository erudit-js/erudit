<script lang="ts" setup>
import type { Contribution } from '@shared/contributor';
import { CONTENT_TYPE_ICON } from '@shared/icons';

defineProps<{
    bookTitle: string;
    contributions: Contribution[];
}>();

const expanded = ref(false);
</script>

<template>
    <div :class="[$style.bookContainer, expanded && $style.expanded]">
        <TreeItem
            :icon="CONTENT_TYPE_ICON.book"
            :label="bookTitle"
            :class="$style.bookTitle"
            @click="expanded = !expanded"
        >
            <MyIcon :class="$style.bookExpandIcon" name="plus" />
        </TreeItem>
        <div :class="$style.bookContributions">
            <TreeItem
                v-for="contribution in contributions"
                :icon="CONTENT_TYPE_ICON[contribution.contentType]"
                :label="contribution.contentTitle"
                :link="contribution.contentLink"
                :level="1"
            />
        </div>
    </div>
</template>

<style lang="scss" module>
.bookContainer {
    .bookTitle {
        @include transition(color, background);
    }

    &.expanded .bookTitle {
        color: var(--text);
    }

    .bookExpandIcon {
        @include transition(transform);
        transform: rotate(0deg);
    }

    &.expanded .bookExpandIcon {
        transform: rotate(45deg);
    }

    .bookContributions {
        overflow: hidden;
        height: 0;
        @include transition(height);
    }

    &.expanded .bookContributions {
        height: auto;
    }
}
</style>
