<script lang="ts" setup>
import type { ContentFlag, ContentFlags } from '@erudit-js/cog/schema';

import type { MyIconName } from '#my-icons';

defineProps<{ flags: ContentFlags }>();

const phrase = await usePhrases(
    'flag_title_dev',
    'flag_title_advanced',
    'flag_title_secondary',
);

const flagData = ((flagType: ContentFlag) => {
    switch (flagType) {
        case 'dev':
            return {
                icon: 'construction',
                title: phrase.flag_title_dev,
            };
        case 'advanced':
            return {
                icon: 'asterisk',
                title: phrase.flag_title_advanced,
            };
        case 'secondary':
            return {
                icon: 'puzzle',
                title: phrase.flag_title_secondary,
            };
    }
}) as (flagType: ContentFlag) => { icon: MyIconName; title: string };

const flagOrder: ContentFlag[] = ['secondary', 'advanced', 'dev'];
</script>

<template>
    <div class="gap-small flex items-center text-xs">
        <div
            v-for="flagType in flagOrder.filter(
                (f) => flags[f] && flags[f] === true,
            )"
            :title="flagData(flagType).title"
        >
            <MyIcon
                :name="flagData(flagType).icon"
                class="text-text-disabled hocus:text-text-dimmed cursor-help
                    transition-[color]"
            />
        </div>
    </div>
</template>
