<script lang="ts" setup>
import { ref } from 'vue';

import { useProseLanguage } from '../../composables/proseLanguage';
import linkIcon from '../../assets/link.svg?raw';
import checkIcon from '../../assets/check.svg?raw';
import AsideMenuButton from './AsideMenuButton.vue';
import { useProseAppContext } from '../../composables/appContext';

const { domId } = defineProps<{
    domId: string;
}>();

const { sitePath } = useProseAppContext();
const prosePhrase = await useProseLanguage();

const copied = ref(false);
let resetTimer: number | undefined;

async function copyLink() {
    await navigator.clipboard.writeText(
        location.origin + sitePath + '#' + domId,
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
