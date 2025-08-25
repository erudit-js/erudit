<script lang="ts" setup>
import GlobalNav from './GlobalNav.vue';
import BookNav from './BookNav.vue';

//
// No leaking state to other
// If need to pass, pass via inject
//

const bookId = ref<string>();
</script>

<template>
    <AsideMajorPaneTemplate :scrollable="false">
        <TransitionSlide :direction="bookId ? 'forward' : 'backward'">
            <KeepAlive>
                <BookNav v-if="bookId" />
                <GlobalNav v-else />
            </KeepAlive>
        </TransitionSlide>
    </AsideMajorPaneTemplate>
</template>
