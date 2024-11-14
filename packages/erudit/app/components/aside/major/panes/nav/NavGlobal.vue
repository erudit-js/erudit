<script lang="ts" setup>
import { getAsideMajorNavPayload } from '@app/scripts/aside/major/nav';

import FNav from './fnav/FNav.vue';
import PaneContentScroll from '../../PaneContentScroll.vue';

const contentRoute = useContentRoute();
const asideMajorNav = getAsideMajorNavPayload();
const globalNav = asideMajorNav.globalNav;
</script>

<template>
    <PaneContentScroll>
        <FNav :nav="globalNav" :contentId="contentRoute?.contentId" />
    </PaneContentScroll>
</template>
