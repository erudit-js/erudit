<script lang="ts" setup>
import ContentNavTopic from './ContentNavTopic.vue';
import ContentNavPage from './ContentNavPage.vue';
import ContentNavBook from './ContentNavBook.vue';
import ContentNavSeparator from './ContentNavSeparator.vue';
import ContentNavFolder from './ContentNavFolder.vue';
import ContentNavFlags from './Flags.vue';

const { navItem } = defineProps<{
    navItem: FrontContentNavItem;
}>();

const NavItemComponent = (() => {
    switch (navItem.type) {
        case 'topic':
            return ContentNavTopic;
        case 'page':
            return ContentNavPage;
        case 'book':
            return ContentNavBook;
        case 'group':
            return navItem.separator ? ContentNavSeparator : ContentNavFolder;
    }
})();
</script>

<template>
    <NavItemComponent :navItem="navItem as any">
        <template v-slot:secondary>
            <ContentNavFlags v-if="navItem.flags" :flags="navItem.flags" />
        </template>
    </NavItemComponent>
</template>
