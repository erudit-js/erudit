<script lang="ts" setup>
import type { BreadcrumbItem } from '@erudit/shared/breadcrumb';

defineProps<{ items: BreadcrumbItem[] }>();
</script>

<template>
    <section v-if="items.length" :class="$style.breadcrumb">
        <template v-for="item in items">
            <NuxtLink
                :to="item.link"
                :prefetch="false"
                :class="$style.breadcrumbItem"
            >
                <MyIcon :name="item.icon" wrapper="span" />
                {{ item.title }}
            </NuxtLink>
            <MyIcon :class="$style.sep" name="angle-right" />
        </template>
    </section>
</template>

<style lang="scss" module>
.breadcrumb {
    position: relative;
    display: flex;
    align-items: center;
    gap: var(--gapSmall);
    padding: var(--_pMainY) var(--_pMainX);
    color: var(--textDimmed);
    overflow: hidden;

    &::after {
        content: '';
        position: absolute;
        top: 0;
        right: 0;
        width: 30px;
        height: 100%;
        background: linear-gradient(to right, transparent, var(--bgMain));
    }

    .breadcrumbItem {
        flex-shrink: 0;
        display: flex;
        align-items: center;
        gap: var(--gapSmall);

        line-height: 0;
        font-weight: 450;
        color: var(--textDimmed);
        text-decoration: none;

        @include transition(color);

        &:hover {
            color: var(--textMuted);
        }
    }

    .sep {
        flex-shrink: 0;
        position: relative;
        top: 0.5px;
    }
}
</style>
