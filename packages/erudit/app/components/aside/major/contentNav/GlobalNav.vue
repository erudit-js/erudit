<script lang="ts" setup>
import ContentNavItem from './items/ContentNavItem.vue';

const { data: globalNavData } = useNuxtData<FrontGlobalContentNav>(
    asideMajorContentNavGlobalKey,
);

const phrase = await usePhrases('no_content');
</script>

<template>
    <ScrollHolder direction="rtl" class="absolute top-0 left-0">
        <TreeContainer v-if="globalNavData!.frontNavItems.length > 0">
            <ContentNavItem
                v-for="navItem in globalNavData!.frontNavItems"
                :navItem
            />
        </TreeContainer>
        <div v-else class="p-big text-text-dimmed text-center font-semibold">
            {{ phrase.no_content }}
        </div>
    </ScrollHolder>
</template>
