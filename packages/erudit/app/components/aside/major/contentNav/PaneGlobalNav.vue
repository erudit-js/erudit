<script lang="ts" setup>
import ContentNavItem from './items/ContentNavItem.vue';

const phrase = await usePhrases('no_content');
</script>

<template>
    <AsideMajorPaneTemplate>
        <ScrollHolder direction="rtl" class="absolute top-0 left-0">
            <TreeContainer v-if="globalContentNav.frontNavItems.length > 0">
                <ContentNavItem
                    v-for="navItem in globalContentNav.frontNavItems"
                    :navItem
                />
            </TreeContainer>
            <AsidePlainMessage :text="phrase.no_content" />
        </ScrollHolder>
    </AsideMajorPaneTemplate>
</template>
