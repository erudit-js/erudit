<script lang="ts" setup>
import type { ContentFlag } from '@erudit-js/cog/schema';

import type { ContentGenericData } from '@shared/content/data/base';

import ContentPopover from './ContentPopover.vue';
import type { PopoverData } from '@shared/popover';
import { type MyIconName } from '#my-icons';

const props = defineProps<{
    generic: ContentGenericData /* TODO: customPopovers[] */;
}>();

const phrase = await usePhrases(
    'flag_dev',
    'flag_dev_description',
    'flag_advanced',
    'flag_advanced_description',
    'flag_secondary',
    'flag_secondary_description',
    'popover_dependencies',
    'popover_dependencies_description',
);

const flagData: Record<ContentFlag, PopoverData> = {
    dev: {
        icon: <MyIconName>'construction',
        color: 'var(--warn)',
        title: phrase.flag_dev,
        description: phrase.flag_dev_description,
    },
    advanced: {
        icon: <MyIconName>'asterisk',
        color: '#7c67ac',
        title: phrase.flag_advanced,
        description: phrase.flag_advanced_description,
    },
    secondary: {
        icon: <MyIconName>'puzzle',
        color: '#7faf35',
        title: phrase.flag_secondary,
        description: phrase.flag_secondary_description,
    },
};

const dependenciesData: PopoverData = {
    icon: <MyIconName>'shuffle',
    color: '#47baa9',
    title: phrase.popover_dependencies,
    description: phrase.popover_dependencies_description,
};

const hasPopovers = computed(() => {
    if (props.generic?.flags && Object.keys(props.generic.flags)?.length)
        return true;

    if (props.generic?.dependencies) return true;

    return false;
});
</script>

<template>
    <section v-if="hasPopovers" :class="$style.popovers">
        <ContentPopover
            v-for="flagName of Object.keys(generic.flags) as ContentFlag[]"
            :data="flagData[flagName]"
        />

        <ContentPopover v-if="generic?.dependencies" :data="dependenciesData">
            <ul :class="$style.dependenciesList">
                <li v-for="(value, key) in generic.dependencies">
                    <MyIcon :name="'arrow-left'" wrapper="span" />
                    <NuxtLink :prefetch="false" :to="key">{{ value }}</NuxtLink>
                </li>
            </ul>
        </ContentPopover>
    </section>
</template>

<style lang="scss" module>
.popovers {
    display: flex;
    flex-wrap: wrap;
    gap: var(--gap);
    padding: var(--_pMainY) var(--_pMainX);
}

.dependenciesList {
    margin-top: var(--gapSmall);
    list-style-type: none;
    list-style-position: inside;
    padding-inline-start: 0;

    li {
        display: flex;
        gap: var(--gapSmall);
        align-items: center;

        [my-icon] {
            flex-shrink: 0;
            font-size: 0.95em;
            transform: scaleX(-1);
        }

        a {
            color: inherit;
        }
    }
}
</style>
