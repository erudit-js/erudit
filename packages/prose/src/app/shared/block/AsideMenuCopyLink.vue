<script lang="ts" setup>
import { ref } from 'vue';

import { useProseContext } from '../../composables/context.js';
import { useProseLanguage } from '../../composables/language.js';
import AsideMenuButton from './AsideMenuButton.vue';
import linkIcon from '../assets/link.svg?raw';
import checkIcon from '../assets/check.svg?raw';

const { elementId } = defineProps<{
    elementId: string;
}>();

const { pathUrl, baseUrl } = useProseContext();
const prosePhrase = await useProseLanguage();

const copied = ref(false);
let resetTimer: number | undefined;

async function copyLink() {
    await navigator.clipboard.writeText(
        location.origin + baseUrl + pathUrl.substring(1) + '#' + elementId,
    );
    copied.value = true;
    if (resetTimer) clearTimeout(resetTimer);
    resetTimer = window.setTimeout(() => {
        copied.value = false;
        resetTimer = undefined;
    }, 2500);
}
</script>

<template>
    <AsideMenuButton
        :brand="copied"
        :icon="copied ? checkIcon : linkIcon"
        :title="copied ? prosePhrase.copied : prosePhrase.copy_link"
        @click="copyLink"
    />
</template>
