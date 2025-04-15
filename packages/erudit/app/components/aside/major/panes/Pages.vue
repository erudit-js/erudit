<script setup lang="ts">
import PaneContentScroll from '../PaneContentScroll.vue';

const route = useRoute();

const phrase = await usePhrases('main_page', 'members');

const { data: memberCount } = await useAsyncData<number>('members-count', () =>
    $fetch('/api/contributor/count'),
);

function linkAttrs(link: string) {
    return {
        link,
        active: route.path === link,
    };
}
</script>

<template>
    <PaneContentScroll>
        <AsideListItem
            icon="house"
            v-bind="linkAttrs('/')"
            :main="phrase.main_page"
        />
        <AsideListItem
            icon="users"
            v-bind="linkAttrs('/members')"
            :main="phrase.members"
            :secondary="memberCount!.toString()"
        />
    </PaneContentScroll>
</template>
